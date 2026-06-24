using KoiHR.Api.Dtos.Salary.Entry;

namespace KoiHR.Api.Services
{
    public interface ISalaryEntryService
    {
        Task<(bool Success, string? Error, List<SalaryEntryGetDto>? Result)> GenerateSalaryEntriesAsync(int month, int year);
        Task<List<SalaryEntryGetDto>> GetSalaryEntriesAsync(int month, int year);
    }
}
