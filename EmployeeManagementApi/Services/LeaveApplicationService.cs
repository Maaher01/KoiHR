using EmployeeManagementApi.Dtos.Leave.Applications;
using EmployeeManagementApi.Enums;
using EmployeeManagementApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Services
{
    public class LeaveApplicationService : ILeaveApplicationService
    {
        private readonly EmployeeDbContext _context;

        public LeaveApplicationService(EmployeeDbContext context)
        {
            _context = context;
        }

        public async Task<List<LeaveApplicationGetDto>> GetAllLeaveApplicationsAsync()
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

            return allLeaveApps;
        }

        public async Task<(bool Success, string? Error, List<LeaveApplicationGetDto>? Result)> GetLeaveApplicationsByEmployeeAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return (false, "No employee record found for this user", null);

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

            return (true, null, applications);
        }

        public async Task<(bool Success, string? Error, LeaveApplicationGetDto? Result)> CreateLeaveApplicationAsync(string userId, LeaveApplicationCreateDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return (false, "No employee record found for this user", null);

            if (dto.StartDate > dto.EndDate) return (false, "Start date cannot be after end date.", null);

            var employee = await _context.Employees.FindAsync(user.Employee.Id);
            if (employee == null) return (false, "Employee not found", null);

            var leaveType = await _context.LeaveTypes.FindAsync(dto.LeaveTypeId);
            if (leaveType == null) return (false, "Leave type not found", null);

            var hasOverlap = await _context.LeaveApplications
                .AnyAsync(a => a.EmployeeId == user.Employee.Id
                    && a.Status != LeaveStatus.Rejected
                    && a.StartDate <= dto.EndDate
                    && a.EndDate >= dto.StartDate);
            if (hasOverlap) return (false, "Leave application overlaps with an existing application.", null);

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

            return (true, null, result);
        }

        public async Task<(bool Success, string? Error)> UpdateLeaveStatusAsync(int id, LeaveStatusUpdateDto dto)
        {
            var existingLeaveApplication = await _context.LeaveApplications.FindAsync(id);
            if (existingLeaveApplication == null) return (false, "Leave application not found");

            if (existingLeaveApplication.Status != LeaveStatus.Pending)
            {
                return (false, "Only pending application status can be updated");
            }

            existingLeaveApplication.Status = dto.Status;

            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<(bool Success, string? Error)> DeleteLeaveApplicationAsync(int id)
        {
            var application = await _context.LeaveApplications.FindAsync(id);
            if (application == null) return (false, "Leave application not found");

            _context.LeaveApplications.Remove(application);
            await _context.SaveChangesAsync();

            return (true, null);
        }
    }
}
