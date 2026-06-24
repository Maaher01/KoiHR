using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Models
{
    public class SalaryBenefit
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsAddition { get; set; }
        [Precision(10, 2)]
        public decimal Amount { get; set; }
    }
}
