using EmployeeManagementApi.Enums;
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Dtos.Employee
{
    public class EmployeeCreateUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
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
