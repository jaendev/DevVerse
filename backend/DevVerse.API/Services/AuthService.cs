using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using DevVerse.API.Models.Config;
using DevVerse.API.Data.Context;
using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.DTOs.User;
using DevVerse.API.Models.Domain;
using DevVerse.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DevVerse.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly JwtSettings _jwtSettings;
    private readonly IMapper _mapper;

    public AuthService(ApplicationDbContext context,
        IOptions<JwtSettings> jwtSettings,
        IMapper mapper)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value;
        _mapper = mapper;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        try
        {
            // Verify if the email is already in use
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "The email is already in use.",
                };
            }
            
            // Verify if the name is already in use
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "The name is already in use.",
                };
            }
            
            // Create a new user
            var user = new User
            {
                Email = request.Email,
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            // Generate token
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "User registered successfully.",
                Token = token,
                User = _mapper.Map<UserDto>(user)
            };
        }
        catch (Exception e)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Error registering user: " + e.Message
            };
        }
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password."
                };
            }
            
            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "User logged in successfully.",
                Token = token,
                User = _mapper.Map<UserDto>(user)
            };
        }
        catch (Exception e)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = "Error logging in user: " + e.Message
            };
        }
    }
    
    public string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddMinutes(_jwtSettings.TokenExpiryInMinutes);
        
        var claims = new[]
        {
           new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
           new Claim(JwtRegisteredClaimNames.Email, user.Email),
           new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
           new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}