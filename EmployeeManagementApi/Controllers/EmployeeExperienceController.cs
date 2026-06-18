using EmployeeManagementApi.Dtos.Employee.Experience;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeExperienceController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public EmployeeExperienceController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> GetByEmployeeId(int employeeId)
        {
            var experiences = await _context.EmployeeExperience
                .Where(e => e.Id == employeeId)
                .ToListAsync();

            return Ok(experiences);
        }

        [HttpPost("{employeeId}")]
        public async Task<IActionResult> Create(int employeeId, [FromBody] EmployeeExperienceCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == employeeId);
            if (!employeeExists) return NotFound("Employee not found");

            var experience = new EmployeeExperience
            {
                EmployeeId = employeeId,
                CompanyName = dto.CompanyName,
                Designation = dto.Designation,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
            };

            _context.EmployeeExperience.Add(experience);
            await _context.SaveChangesAsync();

            return Ok(experience);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeExperienceCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingExperience = await _context.EmployeeExperience.FindAsync(id);
            if (existingExperience == null) return NotFound();

            existingExperience.CompanyName = dto.CompanyName;
            existingExperience.Designation = dto.Designation;
            existingExperience.StartDate = dto.StartDate;
            existingExperience.EndDate = dto.EndDate;

            await _context.SaveChangesAsync();

            return Ok(existingExperience);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var experience = await _context.EmployeeExperience.FindAsync(id);
            if (experience == null) return NotFound("Experience not found");

            _context.EmployeeExperience.Remove(experience);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
