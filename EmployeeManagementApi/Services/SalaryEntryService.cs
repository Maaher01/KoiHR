using EmployeeManagementApi.Dtos.Salary.Benefits;
using EmployeeManagementApi.Dtos.Salary.Entry;
using EmployeeManagementApi.Enums;
using EmployeeManagementApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Services
{
    public class SalaryEntryService : ISalaryEntryService
    {
        private readonly EmployeeDbContext _context;

        public SalaryEntryService(EmployeeDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string? Error, List<SalaryEntryGetDto>? Result)> GenerateSalaryEntriesAsync(int month, int year)
        {
            if (month < 1 || month > 12) return (false, "Month must be between 1 and 12.", null);

            var monthStart = new DateOnly(year, month, 1);
            var currentMonthStart = new DateOnly(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            if (monthStart >= currentMonthStart) return (false, "Cannot generate payroll for the current or a future month.", null);

            var alreadyGenerated = await _context.SalaryEntries
                .AnyAsync(s => s.Month == month && s.Year == year);
            if (alreadyGenerated) return (false, "Salary entries for this month have already been generated.", null);

            
            var daysInMonth = DateTime.DaysInMonth(year, month);
            var employees = await _context.Employees.ToListAsync();
            var allAttendances = await _context.Attendances
                .Where(a => a.Date.Month == month && a.Date.Year == year)
                .ToListAsync();
            var allWeekends = await _context.Weekends.ToListAsync();
            var salaryBenefits = await _context.SalaryBenefits.ToListAsync();

            var result = new List<SalaryEntryGetDto>();

            foreach (var e in employees)
            {
                int workingDays = 0;
                for (int day = 1; day <= daysInMonth; day++)
                {
                    var date = new DateOnly(year, month, day);
                    bool isWeekend = allWeekends.Any(w => w.Day == date.DayOfWeek && w.DepartmentId == e.DepartmentId);

                    if (!isWeekend) workingDays++;
                }

                var attendances = allAttendances
                    .Where(a => a.EmployeeId == e.Id)
                    .ToList();

                int presentDays = attendances.Count(a =>
                    a.Status == AttendanceStatus.Present ||
                    a.Status == AttendanceStatus.Late ||
                    a.Status == AttendanceStatus.Holiday ||
                    a.Status == AttendanceStatus.Leave);

                int absentDays = workingDays - presentDays;

                var basicSalary = e.BasicSalary;
                var perDaySalary = basicSalary / 30;
                var absentDeduction = perDaySalary * absentDays;

                var employeeDeductionBenefits = salaryBenefits
                    .Where(b => b.IsAddition == false)
                    .Sum(b => (e.BasicSalary * b.Amount) / 100);

                var employeeAdditionBenefits = salaryBenefits
                    .Where(b => b.IsAddition == true)
                    .Sum(b => (e.BasicSalary * b.Amount) / 100);

                var benefitBreakdown = salaryBenefits.Select(b => new SalaryBenefitDto
                {
                    Title = b.Title,
                    IsAddition = b.IsAddition,
                    Amount = (e.BasicSalary * b.Amount) / 100
                }).ToList();

                var netSalary = (perDaySalary * workingDays)
                                - absentDeduction
                                + employeeAdditionBenefits
                                - employeeDeductionBenefits;

                var entry = new SalaryEntry
                {
                    EmployeeId = e.Id,
                    Year = year,
                    Month = month,
                    GeneratedAt = DateTime.UtcNow,
                    WorkingDays = workingDays,
                    PresentDays = presentDays,
                    AbsentDays = absentDays,
                    BasicSalary = e.BasicSalary,
                    AbsentDeduction = absentDeduction,
                    AdditionBenefits = employeeAdditionBenefits,
                    DeductionBenefits = employeeDeductionBenefits,
                    NetSalary = netSalary,

                };

                _context.SalaryEntries.Add(entry);

                var dto = new SalaryEntryGetDto
                {
                    EntryId = entry.Id,
                    EmployeeId = e.Id,
                    EmployeeName = e.Name!,
                    Year = year,
                    Month = month,
                    WorkingDays = workingDays,
                    PresentDays = presentDays,
                    AbsentDays = absentDays,
                    BasicSalary = e.BasicSalary,
                    AbsentDeduction = absentDeduction,
                    AdditionBenefits = employeeAdditionBenefits,
                    DeductionBenefits = employeeDeductionBenefits,
                    BenefitBreakdown = benefitBreakdown,
                    NetSalary = netSalary
                };

                result.Add(dto);
            }

            await _context.SaveChangesAsync();

            return (true, null,  result);
        }

        public async Task<List<SalaryEntryGetDto>> GetSalaryEntriesAsync(int month, int year)
        {
            var salaryBenefits = await _context.SalaryBenefits.ToListAsync();

            var entries = await _context.SalaryEntries
                .Include(e => e.Employee)
                .Where(e => e.Month == month && e.Year == year)
                .OrderByDescending(e => e.BasicSalary)
                .ToListAsync();

            var entryIds = entries.Select(e => e.Id).ToList();

            var paidEntryIds = await _context.SalaryPayments
                .Where(p => entryIds.Contains(p.SalaryEntryId))
                .Select(p => p.SalaryEntryId)
                .ToListAsync();

            var result = entries.Select(e => new SalaryEntryGetDto
            {
                EntryId = e.Id,
                EmployeeId = e.EmployeeId,
                EmployeeName = e.Employee!.Name!,
                Year = e.Year,
                Month = e.Month,
                WorkingDays = e.WorkingDays,
                PresentDays = e.PresentDays,
                AbsentDays = e.AbsentDays,
                BasicSalary = e.BasicSalary,
                AbsentDeduction = e.AbsentDeduction,
                AdditionBenefits = e.AdditionBenefits,
                DeductionBenefits = e.DeductionBenefits,
                NetSalary = e.NetSalary,
                IsPaid = paidEntryIds.Contains(e.Id),
                BenefitBreakdown = salaryBenefits.Select(b => new SalaryBenefitDto
                {
                    Title = b.Title,
                    IsAddition = b.IsAddition,
                    Amount = (e.BasicSalary * b.Amount) / 100
                }).ToList()
            }).ToList();

            return result;
        }
    }
}
