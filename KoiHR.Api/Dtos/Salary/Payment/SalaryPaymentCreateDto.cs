using KoiHR.Api.Enums;

namespace KoiHR.Api.Dtos.Salary.Payment
{
    public class SalaryPaymentCreateDto
    {
        public DateTime PayDate { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
