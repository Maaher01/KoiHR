using KoiHR.Api.Dtos.Auth;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _user;
        private readonly KoiHRDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(UserManager<AppUser> user, KoiHRDbContext context, IConfiguration config, RoleManager<IdentityRole> roleManager)
        {
            _user = user;
            _context = context;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _user.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid email or password");

            var passwordValid = await _user.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid) return Unauthorized("Invalid email or password");

            var token = await GenerateJwtToken(user);

            return Ok(new AuthResponseDto
            {
                Token = token,
            });
        }

        private async Task<string> GenerateJwtToken(AppUser user)
        {
            await _context.Users
                .Include(u => u.Employee)
                .ThenInclude(e => e.Department)
                .Where(u => u.Id == user.Id)
                .LoadAsync();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AppSettings:JwtSecret"]!));
            var roles = await _user.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim("uid", user.Id),
                new Claim("email", user.Email!),
                new Claim("role", roles.First())
            };

            if(user.Employee != null)
            {
                claims.Add(new Claim("name", user.Employee.Name));
                claims.Add(new Claim("employeeId", user.Employee.Id.ToString()));
                claims.Add(new Claim("image", user.Employee.Image!));
                claims.Add(new Claim("department", user.Employee.Department.Name));
                claims.Add(new Claim("dateOfJoining", user.Employee.DateOfJoining.ToString("yyyy-MM-dd")));
            }

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("refresh-token")]
        [Authorize]
        public async Task<IActionResult> RefreshToken()
        {
            var userId = User.FindFirstValue("uid");
            var user = await _user.FindByIdAsync(userId!);
            if (user == null) return NotFound();

            var token = await GenerateJwtToken(user);
            return Ok(new { token });
        }
    }
}
