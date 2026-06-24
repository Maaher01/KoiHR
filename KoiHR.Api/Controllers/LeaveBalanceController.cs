using KoiHR.Api.Dtos.Leave.Balance;
using KoiHR.Api.Enums;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveBalanceController : ControllerBase
    {
        private readonly KoiHRDbContext _context;

        public LeaveBalanceController(KoiHRDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Employee,HR")]
        public async Task<IActionResult> GetMyLeaveBalance()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return NotFound("No employee record found for this user");

            var leaveTypes = await _context.LeaveTypes.ToListAsync();

            var approvedLeaves = await _context.LeaveApplications
                .Where(al => al.EmployeeId == user.Employee.Id
                            && al.Status == LeaveStatus.Approved
                            && al.StartDate.Year == DateTime.Today.Year)
                .ToListAsync();

            var result = leaveTypes.Select(lt =>
            {
                var usedDays = approvedLeaves
                            .Where(al => al.LeaveTypeId == lt.Id)
                            .Sum(al => al.EndDate.DayNumber - al.StartDate.DayNumber + 1);

                return new LeaveBalanceDto
                {
                    LeaveTypeId = lt.Id,
                    LeaveTypeName = lt.Name,
                    MaxDaysPerYear = lt.MaxDaysPerYear,
                    UsedDays = usedDays,
                    RemainingDays = lt.MaxDaysPerYear - usedDays
                };
            });

            return Ok(result);
        }

        [HttpGet("{employeeId}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetLeaveBalanceByEmployee(int employeeId)
        {
            var leaveTypes = await _context.LeaveTypes.ToListAsync();

            var approvedLeaves = await _context.LeaveApplications
                .Where(al => al.EmployeeId == employeeId
                            && al.Status == LeaveStatus.Approved
                            && al.StartDate.Year == DateTime.Today.Year)
                .ToListAsync();

            var result = leaveTypes.Select(lt =>
            {
                var usedDays = approvedLeaves
                            .Where(al => al.LeaveTypeId == lt.Id)
                            .Sum(al => al.EndDate.DayNumber - al.StartDate.DayNumber + 1);

                return new LeaveBalanceDto
                {
                    LeaveTypeName = lt.Name,
                    MaxDaysPerYear = lt.MaxDaysPerYear,
                    UsedDays = usedDays,
                    RemainingDays = lt.MaxDaysPerYear - usedDays
                };
            });

            return Ok(result);
        }
    }
}
