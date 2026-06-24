using KoiHR.Api.Dtos.Leave.Applications;

namespace KoiHR.Api.Services
{
    public interface ILeaveApplicationService
    {
        Task<List<LeaveApplicationGetDto>> GetAllLeaveApplicationsAsync();
        Task<(bool Success, string? Error, List<LeaveApplicationGetDto>? Result)> GetLeaveApplicationsByEmployeeAsync(string userId);
        Task<(bool Success, string? Error, LeaveApplicationGetDto? Result)> CreateLeaveApplicationAsync(string userId, LeaveApplicationCreateDto dto);
        Task<(bool Success, string? Error)> UpdateLeaveStatusAsync(int id, LeaveStatusUpdateDto dto);
        Task<(bool Success, string? Error)> DeleteLeaveApplicationAsync(int id);
    }
}
