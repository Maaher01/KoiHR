namespace KoiHR.Api.Dtos.Attendance.Records
{
    public class AttendanceUpdateDto
    {
        public TimeOnly? OutTime { get; set; }
        public string? Note { get; set; }
    }
}
