using Microsoft.EntityFrameworkCore;
using DevVerse.API.Models.Domain;

namespace DevVerse.API.Data.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<TechStack> TechStacks { get; set; } = null!;
    public DbSet<UserTech> UserTechs { get; set; } = null!;
    public DbSet<UserFollower> UserFollowers { get; set; } = null!;

   protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Configuración de User
    modelBuilder.Entity<User>(entity =>
    {
        entity.HasIndex(u => u.Email).IsUnique();
        entity.HasIndex(u => u.Username).IsUnique();
        
        entity.Property(u => u.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.Property(u => u.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    });

    // Configuración de Post
    modelBuilder.Entity<Post>(entity =>
    {
        entity.Property(p => p.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.Property(p => p.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        entity.HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    });

    // Configuración de UserFollower
    modelBuilder.Entity<UserFollower>(entity =>
    {
        entity.HasKey(uf => new { uf.FollowerId, uf.FollowingId });

        entity.Property(uf => uf.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        entity.HasOne(uf => uf.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(uf => uf.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        entity.HasOne(uf => uf.Following)
            .WithMany(u => u.Followers)
            .HasForeignKey(uf => uf.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);
    });

    // Configuración de UserTech
    modelBuilder.Entity<UserTech>(entity =>
    {
        entity.HasKey(ut => new { ut.UserId, ut.TechStackId });

        entity.Property(ut => ut.AddedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        entity.HasOne(ut => ut.User)
            .WithMany(u => u.UserTechs)
            .HasForeignKey(ut => ut.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(ut => ut.TechStack)
            .WithMany(ts => ts.UserTechs)
            .HasForeignKey(ut => ut.TechStackId)
            .OnDelete(DeleteBehavior.Restrict);
    });

    // Configuración de PostTag
    modelBuilder.Entity<PostTag>(entity =>
    {
        entity.HasKey(pt => new { pt.PostId, pt.Tag });

        entity.HasOne(pt => pt.Post)
            .WithMany(p => p.Tags)
            .HasForeignKey(pt => pt.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    });
}
}