using KoiHR.Api.Dtos.Employee.Records;

namespace KoiHR.Api.Services
{
    public interface IEmployeeService
    {
        Task<List<EmployeeGetDto>> GetEmployeesAsync();
        Task<EmployeeGetDto?> GetEmployeeByIdAsync(int id);
        Task<(bool Success, string? Error, EmployeeGetDto? Result)> AddEmployeeAsync(EmployeeCreateUpdateDto dto);
        Task<(bool Success, string? Error, EmployeeGetDto? Result)> UpdateEmployeeAsync(int id, EmployeeCreateUpdateDto dto);
        Task<bool> DeleteEmployeeByid(int id);
        Task<string> SaveEmployeeImageAsync(IFormFile file);
        Task<bool> UpdateEmployeeImageAsync(int id, string image);
    }
}
