using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Dtos.Leave.Applications
{
    public class LeaveApplicationGetDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public DateTime AppliedAt { get; set; }
        public int Duration { get; set; }
        public string? Note { get; set; }
        public LeaveStatus Status { get; set; }
    }
}
