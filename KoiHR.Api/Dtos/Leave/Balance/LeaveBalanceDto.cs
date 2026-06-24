namespace KoiHR.Api.Dtos.Leave.Balance
{
    public class LeaveBalanceDto
    {
        public int LeaveTypeId { get; set; }
        public string LeaveTypeName { get; set; }
        public int MaxDaysPerYear { get; set; }
        public int UsedDays { get; set; }
        public int RemainingDays { get; set; }
    }
}
