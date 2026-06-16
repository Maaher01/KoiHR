using EmployeeManagementApi.Dtos.Salary.Payment;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryPaymentController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public SalaryPaymentController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpPost("{entryId}")]
        public async Task<IActionResult> CreateSalaryPayment(int entryId, [FromBody] SalaryPaymentCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var entry = await _context.SalaryEntries.FindAsync(entryId);
            if (entry == null) return NotFound("Salary entry not found");

            var alreadyPaid = await _context.SalaryPayments
                .AnyAsync(p => p.SalaryEntryId == entryId);
            if (alreadyPaid) return Conflict("This salary entry has already been paid.");

            var salaryPayment = new SalaryPayment
            {
                SalaryEntryId = entryId,
                PayDate = dto.PayDate,
                PaymentMethod = dto.PaymentMethod
            };

            _context.SalaryPayments.Add(salaryPayment);
            await _context.SaveChangesAsync();

            return Ok(salaryPayment);
        }
    }
}
