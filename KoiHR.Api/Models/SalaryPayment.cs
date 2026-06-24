using KoiHR.Api.Enums;

namespace KoiHR.Api.Models
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
