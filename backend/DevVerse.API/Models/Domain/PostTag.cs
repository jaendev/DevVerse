namespace DevVerse.API.Models.Domain;

public class PostTag
{
    public Guid PostId { get; set; }
    public string Tag { get; set; } = string.Empty;
    
    public virtual Post Post { get; set; } = null!;
}