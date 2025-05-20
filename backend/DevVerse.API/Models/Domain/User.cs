using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevVerse.API.Models.Domain;

[Table("Users")]
public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    // Enlaces de perfil
    [StringLength(255)]
    public string? GithubProfile { get; set; }

    [StringLength(255)]
    public string? LinkedInProfile { get; set; }

    [StringLength(255)]
    public string? PortfolioUrl { get; set; }

    // Información de perfil
    [StringLength(100)]
    public string? Name { get; set; }

    [StringLength(500)]
    public string? Bio { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }

    [StringLength(255)]
    public string? ProfileImageUrl { get; set; }

    // Autenticación externa
    public string? GithubId { get; set; }

    // Estado de la cuenta
    public bool EmailVerified { get; set; }
    public bool IsActive { get; set; } = true;

    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Propiedades de navegación
    public virtual ICollection<UserTech> UserTechs { get; set; } = new List<UserTech>();
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
    
    [InverseProperty("Follower")]
    public virtual ICollection<UserFollower> Following { get; set; } = new List<UserFollower>();
    
    [InverseProperty("Following")]
    public virtual ICollection<UserFollower> Followers { get; set; } = new List<UserFollower>();
}