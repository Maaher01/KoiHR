namespace KoiHR.Api.Models
{
    public class AttendanceSetting
    {
        public int Id { get; set; }
        public TimeOnly InTime { get; set; }
        public TimeOnly OutTime { get; set; }
        public int GracePeriodMinutes { get; set; }
        public int DepartmentId { get; set; }
        public Department? Department { get; set; }
    }
}
