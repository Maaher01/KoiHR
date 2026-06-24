using KoiHR.Api.Dtos.Attendance.Settings;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class AttendanceSettingsController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public AttendanceSettingsController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.AttendanceSettings
                .Select(s => new AttendanceSettingGetDto
                {
                    Id = s.Id,
                    InTime = s.InTime,
                    OutTime = s.OutTime,
                    GracePeriodMinutes = s.GracePeriodMinutes,
                    DepartmentId = s.DepartmentId,
                    DepartmentName = s.Department.Name
                }).ToListAsync();

            return Ok(settings);
        }

        [HttpPost]
        public async Task<IActionResult> AddSettings([FromBody] AttendanceSettingCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!departmentExists) return BadRequest("Department does not exist");

            var settingExists = await _context.AttendanceSettings.AnyAsync(s => s.DepartmentId == dto.DepartmentId);
            if (settingExists) return BadRequest("Settings for this department already exists");

            var setting = new AttendanceSetting
            {
                InTime = dto.InTime,
                OutTime = dto.OutTime,
                GracePeriodMinutes = dto.GracePeriodMinutes,
                DepartmentId = dto.DepartmentId
            };

            _context.AttendanceSettings.Add(setting);
            await _context.SaveChangesAsync();

            return Ok(setting);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSettings(int id, [FromBody] AttendanceSettingUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var setting = await _context.AttendanceSettings.FindAsync(id);
            if (setting == null) return NotFound();

            setting.InTime = dto.InTime;
            setting.OutTime = dto.OutTime;
            setting.GracePeriodMinutes = dto.GracePeriodMinutes;

            await _context.SaveChangesAsync();
            return Ok(setting);
        }
    }
}
