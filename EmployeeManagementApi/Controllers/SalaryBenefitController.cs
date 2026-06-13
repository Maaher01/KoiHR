using Microsoft.AspNetCore.Mvc;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using EmployeeManagementApi.Dtos.Salary.Benefits;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryBenefitController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public SalaryBenefitController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "HR, Admin")]
        public async Task<IActionResult> GetAllSalaryBenefits()
        {
            var salaryBenefits = await _context.SalaryBenefits.ToListAsync();

            return Ok(salaryBenefits);
        }

        [HttpPost]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> CreateSalaryBenefit([FromBody] SalaryBenefitCreateUpdateDto dto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

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
    }
}
