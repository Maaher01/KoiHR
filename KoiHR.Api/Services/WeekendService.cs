using KoiHR.Api.Dtos.Weekend;
using KoiHR.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Services
{
    public class WeekendService : IWeekendService
    {
        private readonly EmployeeDbContext _context;

        public WeekendService(EmployeeDbContext context)
        {
            _context = context;
        } 

        public async Task<List<object>> GetAllDepartmentWeekendsAsync()
        {
            var result = await _context.Departments
                .Select(d => (object)new
                {
                    DepartmentId = d.Id,
                    DepartmentName = d.Name,
                    WeekendDays = d.Weekends.Select(w => w.Day).ToList()
                }).ToListAsync();

            return result;
        }

        public async Task SetWeekendAsync(WeekendAddDto dto)
        {
            if (dto.Days == null) dto.Days = new List<DayOfWeek>();

            var existing = await _context.Weekends
                .Where(w => w.DepartmentId == dto.DepartmentId)
                .ToListAsync();
            _context.Weekends.RemoveRange(existing);

            if (dto.Days.Any())
            {
                var weekends = dto.Days.Select(day => new Weekend
                {
                    DepartmentId = dto.DepartmentId,
                    Day = day
                });

                await _context.Weekends.AddRangeAsync(weekends);
            }

            await _context.SaveChangesAsync();
        }
    }
}
