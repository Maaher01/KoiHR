namespace EmployeeManagementApi.Dtos.Leave.LeaveType
{
    public class LeaveTypeCreateUpdateDto
    {
        public string Name { get; set; }
        public int MaxDaysPerYear { get; set; }
    }
}
