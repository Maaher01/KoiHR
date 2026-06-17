using EmployeeManagementApi.Dtos.User;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class UserController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public UserController(EmployeeDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.OrderBy(u => u.CreatedAt).ToListAsync();
            var result = new List<UserGetDto>();

            foreach(var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserGetDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault()!
                });
            }
              
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UserCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(dto.Email!);
            if (existingUser != null) return Conflict("A user with this email already exists.");

            if (dto.EmployeeId.HasValue)
            {
                var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId.Value);
                if (!employeeExists) return BadRequest("Employee ID is invalid");
            }

            var callerRole = User.FindFirstValue(ClaimTypes.Role);

            if (callerRole == "Admin" && dto.Role == "Admin") return Forbid();
            if (callerRole == "HR" && dto.Role != "Employee") return Forbid();

            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmployeeId = dto.EmployeeId,
            };

            var createResult = await _userManager.CreateAsync(user, dto.Password!);
            if (!createResult.Succeeded) return BadRequest(createResult.Errors);

            await _userManager.AddToRoleAsync(user, dto.Role!);

            var result = new UserGetDto
            {
                Id = user?.Id,
                Email = user?.Email,
                Role = dto?.Role,
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Email))
            {
                var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    return Conflict("This email is already in use by another user.");
                }

                user.Email = dto.Email;
                user.UserName = dto.Email;
            }

            if(!string.IsNullOrEmpty(dto.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetResult = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
                if (!resetResult.Succeeded) return BadRequest(resetResult.Errors.Select(e => e.Description));
            }

            if(!string.IsNullOrEmpty(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, dto.Role);
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return BadRequest(updateResult.Errors.Select(e => e.Description));

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
