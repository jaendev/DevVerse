using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using DevVerse.API.Services.Interfaces;
using DevVerse.API.Models.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;

namespace DevVerse.API.Controllers;

[ApiController]
[Route("api/auth/")]
public class AuthController: ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterRequestDto request)
    {
        var response = await _authService.RegisterAsync(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
    
    [HttpPost("logout")]
    public async Task<ActionResult<AuthResponseDto>> Logout()
    {
        return Ok();
    }
    
    [HttpGet("verify")]
    [Authorize]
    public async Task<ActionResult<AuthResponseDto>> Verify()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userEmail = User.FindFirst(ClaimTypes.Email).Value;
        return Ok(new
        {
            success = true,
            message = "User logged in successfully.",
            user = userId,
            email = userEmail
        });
    }
    
}