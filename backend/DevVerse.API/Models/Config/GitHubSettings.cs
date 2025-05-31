namespace DevVerse.API.Models.Config;

public class GitHubSettings
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
    public string AuthUrl { get; set; } = "https://github.com/login/oauth/authorize";
    public string TokenUrl { get; set; } = "https://github.com/login/oauth/access_token";
    public string UserApiUrl { get; set; } = "https://api.github.com/user";
}