using EmployeeManagementApi.Dtos.User;

namespace EmployeeManagementApi.Services
{
    public interface IUserService
    {
        Task<List<UserGetDto>> GetUsersAsync();
        Task<(bool Success, string? Error, UserGetDto? Result)> AddUserAsync(string? callerRole, UserCreateDto dto);
        Task<(bool Success, string? Error)> UpdateUserAsync(string id, UserUpdateDto dto);
        Task<(bool Success, string? Error)> DeleteUserAsync(string id);
    }
}
