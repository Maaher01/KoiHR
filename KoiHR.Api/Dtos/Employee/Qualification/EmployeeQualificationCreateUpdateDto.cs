namespace KoiHR.Api.Dtos.Employee.Qualification
{
    public class EmployeeQualificationCreateUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public int PassingYear { get; set; }
        public string? Result { get; set; }
    }
}
