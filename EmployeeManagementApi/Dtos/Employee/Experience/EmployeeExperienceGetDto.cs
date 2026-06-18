namespace EmployeeManagementApi.Dtos.Employee.Experience
{
    public class EmployeeExperienceGetDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }
}
