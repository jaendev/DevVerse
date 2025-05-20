namespace DevVerse.API.Models.Domain;

public class TechStack
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<UserTech> UserTechs { get; set; } = new List<UserTech>();
}