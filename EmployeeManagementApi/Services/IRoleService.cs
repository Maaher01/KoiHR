using EmployeeManagementApi.Dtos.Role;

namespace EmployeeManagementApi.Services
{
    public interface IRoleService
    {
        Task<List<RoleGetDto>> GetRolesAsync(string? callerRole);
    }
}
