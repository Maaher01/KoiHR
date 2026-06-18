namespace EmployeeManagementApi.Dtos.Employee.Qualification
{
    public class EmployeeQualificationGetDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public int PassingYear { get; set; }
        public string? Result { get; set; }
    }
}
