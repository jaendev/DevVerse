using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.Domain;

namespace DevVerse.API.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    string GenerateJwtToken(User user);
}