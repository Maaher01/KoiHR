using KoiHR.Api.Dtos.Leave.LeaveType;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "HR,Admin")]
    public class LeaveTypeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public LeaveTypeController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeaveTypes()
        {
            var leaveTypes = await _context.LeaveTypes.ToListAsync();

            return Ok(leaveTypes);
        }

        [HttpPost]
        public async Task<IActionResult> AddLeaveType([FromBody] LeaveTypeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var leaveType = new LeaveType
            {
                Name = dto.Name,
                MaxDaysPerYear = dto.MaxDaysPerYear
            };

            _context.LeaveTypes.Add(leaveType);
            await _context.SaveChangesAsync();

            return Ok(leaveType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveType(int id, [FromBody] LeaveTypeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingLeaveType = await _context.LeaveTypes.FindAsync(id);
            if (existingLeaveType == null) return NotFound();

            existingLeaveType.Name = dto.Name;
            existingLeaveType.MaxDaysPerYear = dto.MaxDaysPerYear;

            await _context.SaveChangesAsync();

            return Ok(existingLeaveType);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveType(int id)
        {
            var leaveType = await _context.LeaveTypes.FindAsync(id);
            if (leaveType == null) return NotFound("Leave type not found");

            _context.LeaveTypes.Remove(leaveType);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
