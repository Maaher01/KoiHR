namespace KoiHR.Api.Models
{
    public class EmployeeQualification
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public int PassingYear { get; set; }
        public string? Result { get; set; }
    }
}
