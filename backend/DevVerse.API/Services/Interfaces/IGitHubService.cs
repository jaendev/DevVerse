using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.DTOs.User.GitHub;

namespace DevVerse.API.Services.Interfaces;

public interface IGitHubService
{
    string GetAuthorizationUrl(string state);
    Task<AuthResponseDto> AuthenticateWithGitHubAsync(string code, string state);
    Task<GitHubUserDto> GetGitHubUserAsync(string accessToken);
}