using System.ComponentModel.DataAnnotations.Schema;

namespace DevVerse.API.Models.Domain;

[Table("UserTechs")]
public class UserTech
{
    public Guid UserId { get; set; }
    public int TechStackId { get; set; }
    public DateTime AddedAt { get; set; }
    
    public virtual User User { get; set; } = null!;
    public virtual TechStack TechStack { get; set; } = null!;
}