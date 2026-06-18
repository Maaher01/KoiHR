using EmployeeManagementApi.Enums;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [Range(1, int.MaxValue, ErrorMessage = "Department ID must be greater than 0")]
        public int DepartmentId { get; set; }
        public Department? Department { get; set; }
        public string Email { get; set; } = string.Empty;
        [Required]
        public DateTime DateOfJoining { get; set; }
        public string? Image {  get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateOnly DOB { get; set; }
        public Gender Gender { get; set; }
        public string? Designation { get; set; }
        [Precision(10, 2)]
        public decimal BasicSalary { get; set; }
        public ICollection<EmployeeQualification> Qualifications { get; set; } = new List<EmployeeQualification>();
        public ICollection<EmployeeExperience> Experiences { get; set; } = new List<EmployeeExperience>();
    }
}
