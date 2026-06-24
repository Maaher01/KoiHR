using KoiHR.Api.Dtos.Employee.Qualification;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeQualificationController : ControllerBase
    {
        private readonly KoiHRDbContext _context;

        public EmployeeQualificationController(KoiHRDbContext context)
        {
            _context = context;
        }

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> GetByEmployeeId(int employeeId)
        {
            var qualifications = await _context.EmployeeQualifications
                .Where(e => e.Id == employeeId)
                .ToListAsync();

            return Ok(qualifications);
        }

        [HttpPost("{employeeId}")]
        public async Task<IActionResult> Create(int employeeId, [FromBody] EmployeeQualificationCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == employeeId);
            if (!employeeExists) return NotFound("Employee not found");

            var qualification = new EmployeeQualification
            {
                EmployeeId = employeeId,
                Title = dto.Title,
                Institution = dto.Institution,
                PassingYear = dto.PassingYear,
                Result = dto.Result,
            };

            _context.EmployeeQualifications.Add(qualification);
            await _context.SaveChangesAsync();

            return Ok(qualification);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeQualificationCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingQualification = await _context.EmployeeQualifications.FindAsync(id);
            if (existingQualification == null) return NotFound();

            existingQualification.Title = dto.Title;
            existingQualification.Institution = dto.Institution;
            existingQualification.PassingYear = dto.PassingYear;
            existingQualification.Result = dto.Result;

            await _context.SaveChangesAsync();

            return Ok(existingQualification);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var qualification = await _context.EmployeeQualifications.FindAsync(id);
            if (qualification == null) return NotFound("Qualification not found");

            _context.EmployeeQualifications.Remove(qualification);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
