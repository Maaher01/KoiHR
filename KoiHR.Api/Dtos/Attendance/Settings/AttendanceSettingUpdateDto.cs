namespace KoiHR.Api.Dtos.Attendance.Settings
{
    public class AttendanceSettingUpdateDto
    {
        public TimeOnly InTime { get; set; }
        public TimeOnly OutTime { get; set; }
        public int GracePeriodMinutes { get; set; }
    }
}
