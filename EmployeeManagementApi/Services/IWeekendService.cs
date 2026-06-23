using EmployeeManagementApi.Dtos.Weekend;
using EmployeeManagementApi.Models;

namespace EmployeeManagementApi.Services
{
    public interface IWeekendService
    {
        Task<List<object>> GetAllDepartmentWeekendsAsync();
        Task SetWeekendAsync(WeekendAddDto dto);
    }
}
