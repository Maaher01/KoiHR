using FluentAssertions;
using KoiHR.Api.Enums;
using KoiHR.Api.Models;
using KoiHR.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Tests.Services
{
    public class SalaryServiceTests
    {
        private KoiHRDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<KoiHRDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new KoiHRDbContext(options);
        }

        [Fact]
        public async Task GenerateSalaryEntriesAsync_CalculatesNetSalaryCorrectly()
        {
            await using var context = CreateContext();
            context.Departments.Add(new Department { Id = 1, Name = "Engineering" });
            context.Employees.Add(new Employee
            {
                Id = 1,
                Name = "Test Employee",
                DepartmentId = 1,
                Email = "test@koihr.com",
                DateOfJoining = new DateTime(2023, 1, 1),
                DOB = new DateOnly(1990, 5, 15),
                Gender = Gender.Male,
                BasicSalary = 50000,
                Designation = "Software Engineer"
            });
            context.SalaryBenefits.Add(new SalaryBenefit
            {
                Id = 1,
                Title = "House Rent",
                IsAddition = false,
                Amount = 10
            });

            for(int day = 1; day <= 31; day++)
            {
                context.Attendances.Add(new Attendance
                {
                    EmployeeId = 1,
                    Date = new DateTime(2025, 5, day),
                    Status = AttendanceStatus.Present,
                });
            }

            await context.SaveChangesAsync();

            var service = new SalaryEntryService(context);

            var (success, error, result) = await service.GenerateSalaryEntriesAsync(month: 5, year: 2025);

            //Assert
            success.Should().BeTrue();
            error.Should().BeNull();
            result.Should().HaveCount(1);

            var entry = result![0];

            entry.BasicSalary.Should().Be(50000);
            entry.AbsentDays.Should().Be(0);
            entry.AbsentDeduction.Should().Be(0);
            entry.NetSalary.Should().BeApproximately(46666.67m, precision: 0.01m);
        }

        [Fact]
        public async Task GenerateSalaryEntriesAsync_WhenAlreadyGenerated_ReturnsFailure()
        {
            await using var context = CreateContext();

            context.SalaryEntries.Add(new SalaryEntry
            {
                EmployeeId = 1,
                Month = 5,
                Year = 2025,
                WorkingDays = 23,
                PresentDays = 22,
                AbsentDays = 1,
                BasicSalary = 30000,
                AbsentDeduction = 1000,
                AdditionBenefits = 0,
                DeductionBenefits = 0,
                NetSalary = 29000
            });
            await context.SaveChangesAsync();

            var service = new SalaryEntryService(context);
            var (success, error, result) = await service.GenerateSalaryEntriesAsync(month: 5, year: 2025);

            success.Should().BeFalse();
            error.Should().Be("Salary entries for this month have already been generated.");
            result.Should().BeNull();
        }

        [Fact]
        public async Task GenerateSalaryEntriesAsync_WithFutureMonth_ReturnsFailure()
        {
            await using var context = CreateContext();
            var service = new SalaryEntryService(context);

            var futureMonth = DateTime.UtcNow.Month;
            var futureYear = DateTime.UtcNow.Year;

            var (success, error, _) = await service.GenerateSalaryEntriesAsync(futureMonth, futureYear);

            success.Should().BeFalse();
            error.Should().Be("Cannot generate payroll for the current or a future month.");
        }
    }
}
