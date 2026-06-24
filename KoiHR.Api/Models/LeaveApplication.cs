using KoiHR.Api.Enums;

namespace KoiHR.Api.Models
{
    public class LeaveApplication
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public int LeaveTypeId { get; set; }
        public LeaveType? LeaveType { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public string? Note { get; set; }
        public LeaveStatus Status { get; set; }
    }
}
