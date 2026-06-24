namespace KoiHR.Api.Dtos.Weekend
{
    public class WeekendAddDto
    {
        public int DepartmentId { get; set; }
        public List<DayOfWeek> Days { get; set; } = new();
    }
}
