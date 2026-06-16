using EmployeeManagementApi.Enums;

namespace EmployeeManagementApi.Dtos.Salary.Payment
{
    public class SalaryPaymentCreateDto
    {
        public DateTime PayDate { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
