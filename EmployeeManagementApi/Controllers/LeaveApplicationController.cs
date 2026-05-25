using EmployeeManagementApi.Dtos.Leave.Applications;
using EmployeeManagementApi.Enums;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveApplicationController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public LeaveApplicationController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> GetAllLeaveApplications()
        {
            var allLeaveApps = await _context.LeaveApplications
                .OrderByDescending(l => l.AppliedAt)
                .Select(l => new LeaveApplicationGetDto
                {
                    Id = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = l.Employee!.Name!,
                    LeaveTypeId = l.LeaveTypeId,
                    LeaveTypeName = l.LeaveType!.Name,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    AppliedAt = l.AppliedAt,
                    Duration = (l.EndDate.DayNumber - l.StartDate.DayNumber) + 1,
                    Note = l.Note,
                    Status = l.Status
                }).ToListAsync();

            return Ok(allLeaveApps);
        }

        [HttpGet("employee")]
        [Authorize(Roles = "Employee,HR")]
        public async Task<IActionResult> GetLeaveApplicationsByEmployee()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            var applications = await _context.LeaveApplications
                .Where(l => l.EmployeeId == user.Employee.Id)
                .Select(l => new LeaveApplicationGetDto
                {
                    Id = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = l.Employee!.Name!,
                    LeaveTypeId = l.LeaveTypeId,
                    LeaveTypeName = l.LeaveType!.Name,
                    StartDate = l.StartDate,
                    EndDate = l.EndDate,
                    AppliedAt = l.AppliedAt,
                    Duration = (l.EndDate.DayNumber - l.StartDate.DayNumber) + 1,
                    Note = l.Note,
                    Status = l.Status
                })
                .OrderByDescending(l => l.AppliedAt)
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPost]
        [Authorize(Roles = "Employee,HR")]
        public async Task<IActionResult> CreateLeaveApplication([FromBody] LeaveApplicationCreateDto dto)
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            if (dto.StartDate > dto.EndDate) return BadRequest("Start date cannot be after end date.");
            
            var employee = await _context.Employees.FindAsync(user.Employee.Id);
            if (employee == null) return NotFound("Employee not found");

            var leaveType = await _context.LeaveTypes.FindAsync(dto.LeaveTypeId);
            if (leaveType == null) return NotFound("Leave type not found");

            var hasOverlap = await _context.LeaveApplications
                .AnyAsync(a => a.EmployeeId == user.Employee.Id
                    && a.Status != LeaveStatus.Rejected
                    && a.StartDate <= dto.EndDate
                    && a.EndDate >= dto.StartDate);
            if (hasOverlap) return BadRequest("Leave application overlaps with an existing application.");

            var leaveApplication = new LeaveApplication
            {
                EmployeeId = user.Employee.Id,
                LeaveTypeId = dto.LeaveTypeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Note = dto.Note,
                Status = LeaveStatus.Pending
            };

            _context.LeaveApplications.Add(leaveApplication);
            await _context.SaveChangesAsync();

            var result = new LeaveApplicationGetDto
            {
                Id = leaveApplication.Id,
                EmployeeId = leaveApplication.EmployeeId,
                EmployeeName = employee.Name!,
                LeaveTypeId = leaveApplication.LeaveTypeId,
                LeaveTypeName = leaveType.Name,
                StartDate = leaveApplication.StartDate,
                EndDate = leaveApplication.EndDate,
                AppliedAt = leaveApplication.AppliedAt,
                Duration = (leaveApplication.EndDate.DayNumber - leaveApplication.StartDate.DayNumber) + 1,
                Note = leaveApplication.Note,
                Status = leaveApplication.Status
            };

            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles ="HR,Admin")]
        public async Task<IActionResult> UpdateLeaveStatus(int id, [FromBody] LeaveStatusUpdateDto dto)
        {
            var existingLeaveApplication = await _context.LeaveApplications.FindAsync(id);
            if (existingLeaveApplication == null) return NotFound();

            if (existingLeaveApplication.Status != LeaveStatus.Pending)
            {
                return BadRequest("Only pending application status can be updated");
            }
               
            existingLeaveApplication.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteLeaveApplication(int id)
        {
            var application = await _context.LeaveApplications.FindAsync(id);
            if (application == null) return NotFound("Leave application not found");

            _context.LeaveApplications.Remove(application);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}