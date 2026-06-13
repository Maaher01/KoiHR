namespace EmployeeManagementApi.Dtos.Salary.Benefits
{
    public class SalaryBenefitCreateUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public bool IsAddition { get; set; }
        public decimal Amount { get; set; }
    }
}
