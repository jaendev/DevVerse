using System.ComponentModel.DataAnnotations;

namespace DevVerse.API.Models.DTOs.Auth;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email format is incorrect")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "User name is requiered")]
    [StringLength(50, MinimumLength = 3, 
        ErrorMessage = "The user name must be between 3 and 50 characters")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, MinimumLength = 6, 
        ErrorMessage = "Password must ben between 6 and 100 characters")]
    public string Password { get; set; } = string.Empty;

    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
}