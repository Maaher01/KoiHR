namespace KoiHR.Api.Models
{
    public class Weekend
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public DayOfWeek Day { get; set; }
        public Department Department { get; set; } = null!;
    }
}
