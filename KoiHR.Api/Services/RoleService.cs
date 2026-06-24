using KoiHR.Api.Dtos.Role;
using Microsoft.AspNetCore.Identity;

namespace KoiHR.Api.Services
{
    public class RoleService : IRoleService
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleService(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<List<RoleGetDto>> GetRolesAsync(string? callerRole)
        {
            var roles = _roleManager.Roles
                .Select(r => new RoleGetDto { Name = r.Name }).ToList();

            return callerRole switch

            {
                "Admin" => roles.Where(r => r.Name == "Employee" || r.Name == "HR").ToList(),

                "HR" => roles.Where(r => r.Name == "Employee").ToList(),
                _ => roles
            };
        }
    }
}
