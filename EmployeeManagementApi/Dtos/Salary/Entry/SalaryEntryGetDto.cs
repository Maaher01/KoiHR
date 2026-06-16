using Microsoft.EntityFrameworkCore;
using EmployeeManagementApi.Dtos.Salary.Benefits;

namespace EmployeeManagementApi.Dtos.Salary.Entry
{
    public class SalaryEntryGetDto
    {
        public int EntryId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Month { get; set; }
        public int WorkingDays { get; set; }
        public int PresentDays { get; set; }
        public int AbsentDays { get; set; }
        [Precision(10, 2)]
        public decimal BasicSalary { get; set; }
        [Precision(10, 2)]
        public decimal AbsentDeduction { get; set; }
        [Precision(10, 2)]
        public decimal AdditionBenefits { get; set; }
        [Precision(10, 2)]
        public decimal DeductionBenefits { get; set; }
        [Precision(10, 2)]
        public List<SalaryBenefitDto> BenefitBreakdown { get; set; } = new();
        public decimal NetSalary { get; set; }
        public bool IsPaid { get; set; }
    }
}
