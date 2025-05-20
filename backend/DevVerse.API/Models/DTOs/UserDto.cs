namespace DevVerse.API.Models.DTOs.User;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    
    // Información de perfil
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? Location { get; set; }
    
    // Enlaces profesionales
    public string? GithubProfile { get; set; }
    public string? LinkedInProfile { get; set; }
    public string? PortfolioUrl { get; set; }
    
    // Imagen y estado
    public string? ProfileImageUrl { get; set; }
    public bool EmailVerified { get; set; }
    
    // Estadísticas
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    
    // Stack tecnológico
    public ICollection<string> TechStack { get; set; } = new List<string>();
    
    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}