using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Dtos.Leave.Applications
{
    public class LeaveApplicationCreateDto
    {
        public int LeaveTypeId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string? Note { get; set; }
    }
}
