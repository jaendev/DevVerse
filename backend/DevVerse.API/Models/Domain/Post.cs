namespace DevVerse.API.Models.Domain;

public class Post
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    public virtual User User { get; set; } = null!;
    public virtual ICollection<PostTag> Tags { get; set; } = new List<PostTag>();
}