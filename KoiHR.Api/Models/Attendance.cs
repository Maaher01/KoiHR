using KoiHR.Api.Enums;

namespace KoiHR.Api.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        public DateTime Date { get; set; }
        public TimeOnly? InTime { get; set; }
        public TimeOnly? OutTime { get; set; }
        public AttendanceStatus Status { get; set; }
        public string? Note { get; set; }
    }
}
