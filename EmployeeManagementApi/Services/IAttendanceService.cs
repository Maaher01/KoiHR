using EmployeeManagementApi.Dtos.Attendance.Records;

namespace EmployeeManagementApi.Services
{
    public interface IAttendanceService
    {
        Task<List<AttendanceGetDto>> GetAttendanceByDateAsync(DateTime date);
        Task<(bool Success, string? Error, List<AttendanceGetDto>? Result)> GetEmployeeMonthlyAttendanceAsync(int id, int month, int year);
        Task<(bool Success, string? Error, List<AttendanceGetDto>? Result)> GetEmployeeAttendanceAsync(string userId);
        Task<(bool Success, string? Error, AttendanceGetDto? Result)> GetTodayAttendanceByEmployeeAsync(string userId);
        Task<AttendanceGetDto> GetAttendanceDetailsAsync(int id);
        Task<(bool Success, string? Error, AttendanceGetDto? Result)> MarkAttendanceAsync(string userId, AttendanceCreateDto dto);
        Task<(bool Success, string? Error, AttendanceGetDto? Result)> EmployeeUpdateAttendanceAsync(string userId, AttendanceUpdateDto dto);
    }
}
