using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Dtos.Employee
{
    public class EmployeeGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime DateOfJoining { get; set; }
        public string? Image { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateOnly DOB { get; set; }
        public Gender Gender { get; set; }
        public string? Designation { get; set; }
        public decimal BasicSalary { get; set; }
    }
}
