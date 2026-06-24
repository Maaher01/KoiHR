namespace KoiHR.Api.Dtos.Holiday
{
    public class HolidayCreateUpdateDto
    {
        public string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
