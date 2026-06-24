namespace KoiHR.Api.Dtos.Attendance.Settings
{
    public class AttendanceSettingGetDto
    {
        public int Id { get; set; }
        public TimeOnly InTime { get; set; }
        public TimeOnly OutTime { get; set; }
        public int GracePeriodMinutes { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }
}
