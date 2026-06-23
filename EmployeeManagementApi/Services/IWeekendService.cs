using EmployeeManagementApi.Dtos.Weekend;

namespace EmployeeManagementApi.Services
{
    public interface IWeekendService
    {
        Task<List<object>> GetAllDepartmentWeekendsAsync();
        Task SetWeekendAsync(WeekendAddDto dto);
    }
}
