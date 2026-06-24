using KoiHR.Api.Enums;

namespace KoiHR.Api.Dtos.Attendance.Records
{
    public class AttendanceGetDto
    {
        public int Id { get; set; }
        public int? EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public DateTime Date { get; set; }
        public TimeOnly? InTime { get; set; }
        public TimeOnly? OutTime { get; set; }
        public AttendanceStatus? Status { get; set; }
        public string? Note { get; set; }
    }
}
