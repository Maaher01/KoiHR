namespace EmployeeManagementApi.Dtos.Salary.Benefits
{
    public class SalaryBenefitDto
    {
        public string Title { get; set; } = string.Empty;
        public bool IsAddition { get; set; }
        public decimal Amount { get; set; }
    }
}
