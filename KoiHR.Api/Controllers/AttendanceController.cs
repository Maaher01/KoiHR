using KoiHR.Api.Dtos.Attendance.Records;
using KoiHR.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetAttendanceByDate([FromQuery] DateTime date)
        {
            var result = await _attendanceService.GetAttendanceByDateAsync(date);

            return Ok(result);
        }

        [HttpGet("employee/month")]
        [Authorize(Roles ="Admin,HR")]
        public async Task<IActionResult> GetEmployeeMonthlyAttendance(int id, [FromQuery] int month, [FromQuery] int year)
        {
            var (success, error, result) = await _attendanceService.GetEmployeeMonthlyAttendanceAsync(id, month, year);
            if(!success) return NotFound(error); 

            return Ok(result);
        }
        
        [HttpGet("employee")]
        [Authorize(Roles = "Employee,HR")]
        public async Task<IActionResult> GetEmployeeAttendance()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var (success, error, result) = await _attendanceService.GetEmployeeAttendanceAsync(userId);
            if(!success) return NotFound(error);

            return Ok(result);
        }
        
        [HttpGet("employee/today")]
        [Authorize]
        public async Task<IActionResult> GetTodayAttendanceByEmployee()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var (success, error, result) = await _attendanceService.GetTodayAttendanceByEmployeeAsync(userId);
            if(!success) return NotFound(error);

            return Ok(result);

        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetAttendanceDetails(int id)
        {
            var result = await _attendanceService.GetAttendanceDetailsAsync(id);
            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> MarkAttendance([FromBody] AttendanceCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var (success, error, result) = await _attendanceService.MarkAttendanceAsync(userId, dto);
            if (!success)
            {
                if (error!.Contains("already been given")) return Conflict(error);
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPut("employee/edit")]
        [Authorize]
        public async Task<IActionResult> EmployeeUpdateAttendance([FromBody] AttendanceUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var (success, error, result) = await _attendanceService.EmployeeUpdateAttendanceAsync(userId, dto);
            if (!success)
            {
                if (error!.Contains("already been given")) return Conflict(error);
                return NotFound();
            }

            return Ok(result);
        }
    }
}
