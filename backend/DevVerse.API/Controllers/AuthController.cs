using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using DevVerse.API.Services.Interfaces;
using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.DTOs.User.GitHub;
using Microsoft.AspNetCore.Authorization;

namespace DevVerse.API.Controllers;

[ApiController]
[Route("api/auth/")]
public class AuthController: ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IGitHubService _gitHubService;

    public AuthController(IAuthService authService, IGitHubService gitHubService)
    {
        _authService = authService;
        _gitHubService = gitHubService;
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

    [HttpGet("github/auth")]
    public ActionResult GetGitHubAuthUrl([FromQuery] string? returnUrl = null)
    {
        var state = Guid.NewGuid().ToString();
        // TODO: Store state in cache/session for validation
        var authUrl = _gitHubService.GetAuthorizationUrl(state);
        return Ok(new { authUrl, state });
    }

    [HttpPost("github/callback")]
    public async Task<ActionResult<AuthResponseDto>> GitHubCallback([FromBody] GitHubAuthDto request)
    {
        if (string.IsNullOrEmpty(request.Code))
        {
            return BadRequest( new AuthResponseDto
            {
                Success = false,
                Message = "Code is required."
            });
        }
        
        var response = await _gitHubService.AuthenticateWithGitHubAsync(request.Code, request.State);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
    
}