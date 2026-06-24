using Microsoft.AspNetCore.Mvc;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using KoiHR.Api.Dtos.Salary.Benefits;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "HR,Admin")]
    public class SalaryBenefitController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public SalaryBenefitController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSalaryBenefits()
        {
            var salaryBenefits = await _context.SalaryBenefits.ToListAsync();

            return Ok(salaryBenefits);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSalaryBenefit([FromBody] SalaryBenefitDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var salaryBenefit = new SalaryBenefit
            {
                Title = dto.Title,
                IsAddition = dto.IsAddition,
                Amount = dto.Amount
            };

            _context.SalaryBenefits.Add(salaryBenefit);
            await _context.SaveChangesAsync();

            return Ok(salaryBenefit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalaryBenefit(int id, [FromBody] SalaryBenefitDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var benefit = await _context.SalaryBenefits.FindAsync(id);
            if (benefit == null) return NotFound("Salary benefit not found");

            benefit.Title = dto.Title;
            benefit.Amount = dto.Amount;
            benefit.IsAddition = dto.IsAddition;

            await _context.SaveChangesAsync();

            return Ok(benefit);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSalaryBenefit(int id)
        {
            var benefit = await _context.SalaryBenefits.FindAsync(id);
            if (benefit == null) return NotFound("Salary benefit does not exist");

            _context.SalaryBenefits.Remove(benefit);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
