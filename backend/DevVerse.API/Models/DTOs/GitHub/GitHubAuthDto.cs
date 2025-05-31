using Microsoft.AspNetCore.Mvc;

namespace DevVerse.API.Models.DTOs.GitHub;

public class GitHubAuthDto
{
    public string Code { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
}

public class GitHubUserDto
{
    public long Id { get; set; }
    public string Login { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string HtmlUrl { get; set; } = string.Empty;
    public int PublicRepos { get; set; }
    public int Followers { get; set; }
    public int Following { get; set; }
}

public class GitHubTokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
}