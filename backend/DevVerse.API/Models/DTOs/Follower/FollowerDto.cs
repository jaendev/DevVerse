namespace DevVerse.API.Models.DTOs.Follower;

public class FollowerDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? ProfileImageUrl { get; set; }
    public DateTime FollowingSince { get; set; }
}