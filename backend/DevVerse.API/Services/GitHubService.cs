using System.Text.Json;
using AutoMapper;
using DevVerse.API.Data.Context;
using DevVerse.API.Models.Config;
using DevVerse.API.Models.Domain;
using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.DTOs.User;
using DevVerse.API.Models.DTOs.GitHub;
using Microsoft.Extensions.Options;
using DevVerse.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DevVerse.API.Services;

public class GitHubService : IGitHubService
{
    private readonly ApplicationDbContext _context;
    private readonly GitHubSettings _gitHubSettings;
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;
    private readonly HttpClient _httpClient;

    public GitHubService(
        ApplicationDbContext context,
        IOptions<GitHubSettings> gitHubSettings,
        IAuthService authService,
        IMapper mapper,
        HttpClient httpClient
    )
    {
        _context = context;
        _gitHubSettings = gitHubSettings.Value;
        _authService = authService;
        _mapper = mapper;
        _httpClient = httpClient;
    }

    public string GetAuthorizationUrl(string state)
    {
        var queryParams = new Dictionary<string, string>
        {
            { "client_id", _gitHubSettings.ClientId },
            { "redirect_uri", _gitHubSettings.RedirectUri },
            { "scope", "user:email" },
            { "state", state }
        };

        var queryString = string.Join("&", queryParams.Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));
        Console.Write($"{_gitHubSettings.AuthUrl}?{queryString}");
        return $"{_gitHubSettings.AuthUrl}?{queryString}";
    }

    public async Task<AuthResponseDto> AuthenticateWithGitHubAsync(string code, string state)
    {
        try
        {
            // 1. Exchange code for access token
            var tokenResponse = await ExchangeCodeForAccessTokenAsync(code);
            if (string.IsNullOrEmpty(tokenResponse.AccessToken))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Failed to exchange code for access token."
                };
            }

            // 2. Get user information
            var gitHubUser = await GetGitHubUserAsync(tokenResponse.AccessToken);
            if (gitHubUser == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Failed to get GitHub user information."
                };
            }

            // 3. Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.GithubId == gitHubUser.Id.ToString());

            User user;
            if (existingUser != null)
            {
                // Update existing user info 
                existingUser.Name = gitHubUser.Name;
                existingUser.ProfileImageUrl = gitHubUser.AvatarUrl;
                existingUser.Bio = gitHubUser.Bio;
                existingUser.Location = gitHubUser.Location;
                existingUser.GithubProfile = gitHubUser.HtmlUrl;
                existingUser.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                user = existingUser;
            }
            else
            {
                // Create new user from GitHub data
                user = new User
                {
                    Email = gitHubUser.Email ?? $"{gitHubUser.Login}@github.local",
                    Username = await GenerateUniqueUsernameAsync(gitHubUser.Login),
                    Name = gitHubUser.Name ?? gitHubUser.Login,
                    GithubId = gitHubUser.Id.ToString(),
                    GithubProfile = gitHubUser.HtmlUrl,
                    ProfileImageUrl = gitHubUser.AvatarUrl,
                    Bio = gitHubUser.Bio,
                    Location = gitHubUser.Location,
                    EmailVerified = !string.IsNullOrEmpty(gitHubUser.Email),
                    PasswordHash = string.Empty,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            
            // 4. Generate JWT token
            var token = _authService.GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "GitHub authentication successful.",
                Token = token,
                User = _mapper.Map<UserDto>(user)
            };
        }
        catch (Exception ex)
        {
            return new AuthResponseDto
            {
                Success = false,
                Message = $"GitHub authentication failed: {ex.Message}"
            };
        }
    }

    public async Task<GitHubUserDto> GetGitHubUserAsync(string accessToken)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "DevVerse-App");

            var response = await _httpClient.GetAsync(_gitHubSettings.UserApiUrl);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"GitHub API request failed with status code: {response.StatusCode}");
            }
            
            var json = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            };

            return JsonSerializer.Deserialize<GitHubUserDto>(json, options);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to get GitHub user: {ex.Message}");
        }
    }

    private async Task<GitHubTokenResponse> ExchangeCodeForAccessTokenAsync(string code)
    {
        try
        {
            var requestData = new
            {
                client_id = _gitHubSettings.ClientId,
                client_secret = _gitHubSettings.ClientSecret,
                code = code,
                redirect_uri = _gitHubSettings.RedirectUri,
            };
            
            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "DevVerse-App");
            
            var response = await _httpClient.PostAsync(_gitHubSettings.TokenUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Token exchange failed with status code: {response.StatusCode}");
            }
            
            var responseJson = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            };
            
            return JsonSerializer.Deserialize<GitHubTokenResponse>(responseJson, options);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to exchange code for token: {ex.Message}");
        }
    }

    private async Task<string> GenerateUniqueUsernameAsync(string baseUsername)
    {
        var username = baseUsername.ToLower();
        var counter = 1;

        while (await _context.Users.AnyAsync(u => u.Username == username))
        {
            username = $"{baseUsername.ToLower()}{counter}";
            counter++;
        }
        
        return username;
    }
}