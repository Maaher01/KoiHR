namespace KoiHR.Api.Dtos.Employee.Experience
{
    public class EmployeeExperienceCreateUpdateDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
    }
}
