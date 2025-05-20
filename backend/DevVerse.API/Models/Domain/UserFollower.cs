using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DevVerse.API.Models.Domain;

[Table("UserFollowers")]
public class UserFollower
{
    [Required]
    public Guid FollowerId { get; set; }

    [Required]
    public Guid FollowingId { get; set; }

    public DateTime CreatedAt { get; set; }

    // Propiedades de navegación
    [ForeignKey("FollowerId")]
    public virtual User Follower { get; set; } = null!;

    [ForeignKey("FollowingId")]
    public virtual User Following { get; set; } = null!;
}