using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.DTOs.GitHub;

namespace DevVerse.API.Services.Interfaces;

public interface IGitHubService
{
    string GetAuthorizationUrl(string state);
    Task<AuthResponseDto> AuthenticateWithGitHubAsync(string code, string state);
    Task<AuthResponseDto> AuthenticateWithAccessTokenAsync(string accessToken);
    Task<GitHubUserDto> GetGitHubUserAsync(string accessToken);
}