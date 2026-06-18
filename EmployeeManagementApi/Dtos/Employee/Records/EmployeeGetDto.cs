using EmployeeManagementApi.Dtos.Employee.Experience;
using EmployeeManagementApi.Dtos.Employee.Qualification;
using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Dtos.Employee.Records
{
    public class EmployeeGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime DateOfJoining { get; set; }
        public List<EmployeeQualificationGetDto> Qualifications { get; set; } = new();
        public List<EmployeeExperienceGetDto> Experiences { get; set; } = new();
        public string? Image { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateOnly DOB { get; set; }
        public Gender Gender { get; set; }
        public string? Designation { get; set; }
        public decimal BasicSalary { get; set; }
    }
}
