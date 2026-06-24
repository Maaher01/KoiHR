using KoiHR.Api.Dtos.Attendance.Records;
using KoiHR.Api.Enums;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class DashboardController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public DashboardController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAttendanceByDate([FromQuery] DateTime date)
        {
            var employees = await _context.Employees
                .Select(e => new
                {
                    e.Id,
                    e.Name
                }).ToListAsync();

            var existingRecords = await _context.Attendances
                .Where(a => a.Date == date)
                .ToListAsync();

            var result = employees.Select(e =>
            {
                var record = existingRecords.FirstOrDefault(a => a.EmployeeId == e.Id);

                return new AttendanceGetDto
                {
                    EmployeeName = e.Name,
                    Date = date,
                    InTime = record?.InTime,
                    OutTime = record?.OutTime,
                    Status = record?.Status ?? AttendanceStatus.Absent,
                    Note = record?.Note
                };
            }).ToList();

            var present = result.Count(a => a.Status == AttendanceStatus.Present || a.Status == AttendanceStatus.Late);
            var absent = result.Count(a => a.Status == AttendanceStatus.Absent);

            return Ok(new
            {
                Date = date.ToString("yyyy-MM-dd"),
                Present = present,
                Absent = absent,
            });
        }
    }
}
