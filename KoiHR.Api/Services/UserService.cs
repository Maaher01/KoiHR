using KoiHR.Api.Dtos.User;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Services
{
    public class UserService : IUserService
    {
        private readonly KoiHRDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public UserService(KoiHRDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<List<UserGetDto>> GetUsersAsync()
        {
            var users = await _userManager.Users.OrderBy(u => u.CreatedAt).ToListAsync();
            var result = new List<UserGetDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new UserGetDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Role = roles.FirstOrDefault()!
                });
            }

            return result;
        }

        public async Task<(bool Success, string? Error, UserGetDto? Result)> AddUserAsync(string? callerRole, UserCreateDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email!);
            if (existingUser != null) return (false, "A user with this email already exists.", null);

            if (dto.EmployeeId.HasValue)
            {
                var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId.Value);
                if (!employeeExists) return (false, "Employee ID is invalid", null);
            }

            if (callerRole == "Admin" && dto.Role == "Admin") return (false, "You are not allowed to add admins", null);
            if (callerRole == "HR" && dto.Role != "Employee") return (false, "You are only allowed to add employees", null);

            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmployeeId = dto.EmployeeId,
            };

            var createResult = await _userManager.CreateAsync(user, dto.Password!);
            if (!createResult.Succeeded) return (false, string.Join(", ", createResult.Errors.Select(e => e.Description)), null);

            await _userManager.AddToRoleAsync(user, dto.Role!);

            var result = new UserGetDto
            {
                Id = user?.Id,
                Email = user?.Email,
                Role = dto?.Role,
            };

            return (true, null, result);
        }

        public async Task<(bool Success, string? Error)> UpdateUserAsync(string id, UserUpdateDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return (false, "User not found");

            if (!string.IsNullOrEmpty(dto.Email))
            {
                var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUser != null && existingUser.Id != user.Id)
                {
                    return (false, "This email is already in use by another user.");
                }

                user.Email = dto.Email;
                user.UserName = dto.Email;
            }

            if (!string.IsNullOrEmpty(dto.NewPassword))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetResult = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
                if (!resetResult.Succeeded) return (false, string.Join(", ", resetResult.Errors.Select(e => e.Description)));
            }

            if (!string.IsNullOrEmpty(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, dto.Role);
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return (false, string.Join(", ", updateResult.Errors.Select(e => e.Description)));

            return (true, null);
        }

        public async Task<(bool Success, string? Error)> DeleteUserAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return (false, "User not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return (true, null);
        }
    }
}
