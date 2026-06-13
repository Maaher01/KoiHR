using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Models
{
    public class SalaryEntry
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public int WorkingDays { get; set; }
        public int PresentDays { get; set; }
        public int AbsentDays { get; set; }
        public int LeaveDays { get; set; }
        [Precision(10, 2)]
        public decimal BasicSalary { get; set; }
        [Precision(10, 2)]
        public decimal AbsentDeduction { get; set; }
        [Precision(10, 2)]
        public decimal AdditionBenefits { get; set; }
        [Precision(10, 2)]
        public decimal DeductionBenefits { get; set; }
        [Precision(10, 2)]
        public decimal NetSalary { get; set; }
    }
}
