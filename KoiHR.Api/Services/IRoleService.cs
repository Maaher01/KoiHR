using KoiHR.Api.Dtos.Role;

namespace KoiHR.Api.Services
{
    public interface IRoleService
    {
        Task<List<RoleGetDto>> GetRolesAsync(string? callerRole);
    }
}
