using KoiHR.Api.Dtos.Attendance.Records;
using KoiHR.Api.Enums;
using KoiHR.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly EmployeeDbContext _context;

        public AttendanceService(EmployeeDbContext context)
        {
            _context = context;
        }

        public async Task<List<AttendanceGetDto>> GetAttendanceByDateAsync(DateTime date)
        {
            var employees = await _context.Employees
                .Select(e => new
                {
                    e.Id,
                    e.Name,
                    e.DepartmentId
                }).ToListAsync();

            var existingRecords = await _context.Attendances
                .Where(a => a.Date == date)
                .ToListAsync();

            var allWeekends = await _context.Weekends.ToListAsync();
            var allHolidays = await _context.Holidays
                    .Select(h => new { h.StartDate, h.EndDate })
                    .ToListAsync();
            var approvedLeaves = await _context.LeaveApplications
                    .Where(al => al.Status == LeaveStatus.Approved)
                    .ToListAsync();

            var dateOnly = DateOnly.FromDateTime(date);

            var result = employees.Select(e =>
            {
                var weekendDays = allWeekends
                    .Where(w => w.DepartmentId == e.DepartmentId)
                    .Select(w => w.Day)
                    .ToList();
                if (weekendDays.Contains(date.DayOfWeek))
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = e.Name,
                        Date = date,
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Weekend,
                        Note = null
                    };
                }

                var isHoliday = allHolidays.Any(h => dateOnly >= h.StartDate && dateOnly <= h.EndDate);
                if (isHoliday)
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = e.Name,
                        Date = date,
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Holiday,
                        Note = null
                    };
                }

                var isLeave = approvedLeaves.Any(al => al.EmployeeId == e.Id && dateOnly >= al.StartDate && dateOnly <= al.EndDate);
                if (isLeave)
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = e.Name,
                        Date = date,
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Leave,
                        Note = null
                    };
                }

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

            return result;
        }

        public async Task<(bool Success, string? Error, List<AttendanceGetDto>? Result)> GetEmployeeMonthlyAttendanceAsync(int id, int month, int year)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id);
            if (employee == null) return (false, "Employee not found", null);

            var attendances = await _context.Attendances
                .Where(a => a.EmployeeId == id && a.Date.Month == month && a.Date.Year == year)
                .ToListAsync();

            var weekendDays = await _context.Weekends
                .Where(w => w.DepartmentId == employee.DepartmentId)
                .Select(w => w.Day)
                .ToListAsync();
            var allHolidays = await _context.Holidays
                .Select(h => new { h.StartDate, h.EndDate })
                .ToListAsync();
            var approvedLeaves = await _context.LeaveApplications
                .Where(al => al.EmployeeId == employee.Id
                && al.Status == LeaveStatus.Approved)
                .ToListAsync();

            var today = DateTime.Today;

            var daysInMonth = DateTime.DaysInMonth(year, month);
            var allDates = Enumerable.Range(1, daysInMonth)
                .Select(d => new DateTime(year, month, d))
                .Where(d => d <= today)
                .ToList();

            var result = allDates.Select(date =>
            {
                var dateOnly = DateOnly.FromDateTime(date);

                if (weekendDays.Contains(date.DayOfWeek))
                {
                    return new AttendanceGetDto
                    {
                        Date = date,
                        Status = AttendanceStatus.Weekend,
                        EmployeeId = employee.Id,
                        EmployeeName = employee.Name,
                        InTime = null,
                        OutTime = null,
                        Note = null
                    };
                }

                var isHoliday = allHolidays.Any(h => dateOnly >= h.StartDate && dateOnly <= h.EndDate);
                if (isHoliday)
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = employee.Name,
                        Date = date,
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Holiday,
                        Note = null
                    };
                }

                var isLeave = approvedLeaves.Any(al => dateOnly >= al.StartDate && dateOnly <= al.EndDate);
                if (isLeave)
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = employee.Name,
                        Date = date,
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Leave,
                        Note = null
                    };
                }

                var record = attendances.FirstOrDefault(a => a.Date == date);
                return record != null
                ? new AttendanceGetDto
                {
                    Id = record.Id,
                    EmployeeId = record.EmployeeId,
                    EmployeeName = employee.Name,
                    Date = record.Date,
                    InTime = record.InTime,
                    OutTime = record.OutTime,
                    Status = record.Status,
                    Note = record.Note
                } : new AttendanceGetDto
                {
                    Id = 0,
                    EmployeeId = id,
                    EmployeeName = employee.Name,
                    Date = date,
                    InTime = null,
                    OutTime = null,
                    Status = AttendanceStatus.Absent,
                    Note = null
                };
            }).ToList();

            return (true, null, result);
        }

        public async Task<(bool Success, string? Error, List<AttendanceGetDto>? Result)> GetEmployeeAttendanceAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return (false, "No employee record found for this user", null);

            var employee = user.Employee;

            var weekendDays = await _context.Weekends
                .Where(w => w.DepartmentId == employee.DepartmentId)
                .Select(w => w.Day)
                .ToListAsync();
            var allHolidays = await _context.Holidays
                .Select(h => new { h.StartDate, h.EndDate })
                .ToListAsync();
            var approvedLeaves = await _context.LeaveApplications
                .Where(al => al.EmployeeId == user.Employee.Id
                && al.Status == LeaveStatus.Approved)
                .ToListAsync();

            var dateOfJoining = DateOnly.FromDateTime(employee.DateOfJoining);
            var today = DateOnly.FromDateTime(DateTime.Today);

            var allDates = Enumerable.Range(0, today.DayNumber - dateOfJoining.DayNumber + 1)
                .Select(offset => dateOfJoining.AddDays(offset))
                .ToList();

            var userAttendance = await _context.Attendances
                .Where(a => a.EmployeeId == employee.Id)
                .ToListAsync();

            var result = allDates.Select(date =>
            {
                if (weekendDays.Contains(date.DayOfWeek))
                {
                    return new AttendanceGetDto
                    {
                        Date = date.ToDateTime(TimeOnly.MinValue),
                        Status = AttendanceStatus.Weekend,
                        EmployeeId = employee.Id,
                        EmployeeName = employee.Name,
                        InTime = null,
                        OutTime = null,
                        Note = null
                    };
                }

                var isHoliday = allHolidays.Any(h => date >= h.StartDate && date <= h.EndDate);
                if (isHoliday)
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = employee.Name,
                        Date = date.ToDateTime(TimeOnly.MinValue),
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Holiday,
                        Note = null
                    };
                }

                var isLeave = approvedLeaves.Any(al => date >= al.StartDate && date <= al.EndDate);
                if (isLeave)
                {
                    return new AttendanceGetDto
                    {
                        EmployeeName = employee.Name,
                        Date = date.ToDateTime(TimeOnly.MinValue),
                        InTime = null,
                        OutTime = null,
                        Status = AttendanceStatus.Leave,
                        Note = null
                    };
                }

                var record = userAttendance.FirstOrDefault(a => DateOnly.FromDateTime(a.Date) == date);
                return record != null
                ? new AttendanceGetDto
                {
                    Id = record.Id,
                    EmployeeId = record.EmployeeId,
                    EmployeeName = employee.Name,
                    Date = record.Date,
                    InTime = record.InTime,
                    OutTime = record.OutTime,
                    Status = record.Status,
                    Note = record.Note
                }
                : new AttendanceGetDto
                {
                    Id = 0,
                    EmployeeId = employee.Id,
                    EmployeeName = employee.Name,
                    Date = date.ToDateTime(TimeOnly.MinValue),
                    InTime = null,
                    OutTime = null,
                    Status = AttendanceStatus.Absent,
                    Note = null
                };
            }).OrderByDescending(a => a.Date).ToList();

            return (true, null, result);
        }

        public async Task<(bool Success, string? Error, AttendanceGetDto? Result)> GetTodayAttendanceByEmployeeAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return (false, "No employee record found for this user", null);

            var employee = user.Employee;

            var date = DateTime.Today;

            var todayAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EmployeeId == employee.Id && a.Date == date);

            if (todayAttendance == null)
            {
                return (true, null, (new AttendanceGetDto
                {
                    EmployeeId = employee.Id,
                    EmployeeName = employee.Name,
                    Date = date,
                    InTime = null,
                    OutTime = null,
                    Status = null,
                    Note = null
                }));
            }

            var result = new AttendanceGetDto
            {
                Id = todayAttendance.Id,
                EmployeeId = employee.Id,
                EmployeeName = employee.Name,
                Date = todayAttendance.Date,
                InTime = todayAttendance.InTime,
                OutTime = todayAttendance.OutTime,
                Status = todayAttendance.Status,
                Note = todayAttendance.Note
            };

            return (true, null, result);
        }

        public async Task<AttendanceGetDto> GetAttendanceDetailsAsync(int id)
        {
            var attendance = await _context.Attendances
                .Include(e => e.Employee)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (attendance == null) return null;

            var result = new AttendanceGetDto
            {
                Id = attendance.Id,
                EmployeeId = attendance?.Employee?.Id,
                EmployeeName = attendance?.Employee?.Name,
                Date = attendance.Date,
                InTime = attendance.InTime,
                OutTime = attendance.OutTime,
                Status = attendance.Status,
                Note = attendance.Note
            };

            return result;
        }

        public async Task<(bool Success, string? Error, AttendanceGetDto? Result)> MarkAttendanceAsync(string userId, AttendanceCreateDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return (false, "No employee record found for this user", null);

            var employee = user.Employee;

            var date = DateTime.Today;
            var inTime = TimeOnly.FromDateTime(DateTime.Now);

            var alreadyMarked = await _context.Attendances
                .AnyAsync(a => a.EmployeeId == employee.Id && a.Date == date && a.InTime != null);
            if (alreadyMarked) return (false, $"Attendance for {employee.Name} on {date} has already been given.", null);

            var settings = await _context.AttendanceSettings
                .FirstOrDefaultAsync(s => s.DepartmentId == employee.DepartmentId);

            AttendanceStatus status;
            var allowedTime = settings?.InTime.AddMinutes(settings.GracePeriodMinutes);
            status = allowedTime.HasValue
                ? inTime <= allowedTime ? AttendanceStatus.Present : AttendanceStatus.Late : AttendanceStatus.Present;

            var attendance = new Attendance
            {
                EmployeeId = employee.Id,
                Date = date,
                InTime = inTime,
                OutTime = null,
                Note = dto.Note,
                Status = status
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            var result = new AttendanceGetDto
            {
                Id = attendance.Id,
                EmployeeId = employee.Id,
                EmployeeName = employee.Name,
                Date = attendance.Date,
                InTime = attendance.InTime,
                OutTime = attendance.OutTime,
                Status = attendance.Status,
                Note = attendance.Note
            };

            return (true, null, result);
        }

        public async Task<(bool Success, string? Error, AttendanceGetDto? Result)> EmployeeUpdateAttendanceAsync(string userId, AttendanceUpdateDto dto)
        {
            var user = await _context.Users
                .Include(u => u.Employee)
                .FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.Employee == null) return (false, "No employee record found for this user", null);

            var today = DateTime.Today;

            var existingAttendance = await _context.Attendances
                .Include(a => a.Employee)
                .FirstOrDefaultAsync(a => a.EmployeeId == user.Employee.Id && a.Date == today);

            var outTime = TimeOnly.FromDateTime(DateTime.Now);

            if (existingAttendance == null || existingAttendance.InTime == null)
            {
                return (false, "You must check in before checking out.", null);
            }
            else
            {
                existingAttendance.OutTime = outTime;
            }

            existingAttendance.Note = dto.Note;

            await _context.SaveChangesAsync();

            var result = new AttendanceGetDto
            {
                Id = existingAttendance.Id,
                EmployeeId = existingAttendance.EmployeeId,
                EmployeeName = existingAttendance?.Employee?.Name,
                Date = existingAttendance.Date,
                InTime = existingAttendance.InTime,
                OutTime = existingAttendance.OutTime,
                Status = existingAttendance.Status,
                Note = existingAttendance.Note
            };

            return (true, null, result);
        }
    }
}
