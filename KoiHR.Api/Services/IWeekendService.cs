using KoiHR.Api.Dtos.Weekend;

namespace KoiHR.Api.Services
{
    public interface IWeekendService
    {
        Task<List<object>> GetAllDepartmentWeekendsAsync();
        Task SetWeekendAsync(WeekendAddDto dto);
    }
}
