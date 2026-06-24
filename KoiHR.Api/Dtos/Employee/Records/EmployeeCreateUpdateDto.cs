using KoiHR.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace KoiHR.Api.Dtos.Employee.Records
{
    public class EmployeeCreateUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        [Required]
        public int DepartmentId { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string? Image { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateOnly DOB { get; set; }
        public Gender Gender { get; set; }
        public string? Designation { get; set; }
        [Range(0.01, double.MaxValue, ErrorMessage = "Salary must be greater than 0")]
        public decimal BasicSalary { get; set; }
    }
}
