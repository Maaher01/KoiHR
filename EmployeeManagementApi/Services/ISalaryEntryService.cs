using EmployeeManagementApi.Dtos.Salary.Entry;

namespace EmployeeManagementApi.Services
{
    public interface ISalaryEntryService
    {
        Task<(bool Success, string? Error, List<SalaryEntryGetDto>? Result)> GenerateSalaryEntriesAsync(int month, int year);
        Task<List<SalaryEntryGetDto>> GetSalaryEntriesAsync(int month, int year);
    }
}
