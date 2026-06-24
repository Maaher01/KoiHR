using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Models
{
    public class KoiHRDbContext : IdentityDbContext<IdentityUser>
    {
        public KoiHRDbContext(DbContextOptions<KoiHRDbContext> options) : base(options) {}
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeQualification> EmployeeQualifications { get; set; }
        public DbSet<EmployeeExperience> EmployeeExperience { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<AttendanceSetting> AttendanceSettings { get; set; }
        public DbSet<Weekend> Weekends { get; set; }
        public DbSet<Holiday> Holidays { get; set; }
        public DbSet<LeaveType> LeaveTypes { get; set; }
        public DbSet<LeaveApplication> LeaveApplications { get; set; }
        public DbSet<SalaryBenefit> SalaryBenefits { get; set; }
        public DbSet<SalaryEntry> SalaryEntries { get; set; }
        public DbSet<SalaryPayment> SalaryPayments { get; set; }
        public DbSet<Notice> Notices { get; set; }
    }
}
