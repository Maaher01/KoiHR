using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Models
{
    public class SalaryPayment
    {
        public int Id { get; set; }
        public int SalaryEntryId { get; set; }
        public SalaryEntry? SalaryEntry { get; set; }
        public DateTime PayDate { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
