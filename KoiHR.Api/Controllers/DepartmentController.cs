using KoiHR.Api.Dtos.Department;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class DepartmentController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public DepartmentController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments() 
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentGetDto 
                {
                    Id = d.Id,
                    Name = d.Name
                }).ToListAsync();

            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null) return NotFound();

            var result = new DepartmentGetDto
            {
                Id = department.Id,
                Name = department.Name
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment([FromBody] DepartmentCreateUpdateDto dto) 
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Check duplicate department name
            bool isDuplicate = await _context.Departments.AnyAsync(d => d.Name.ToLower() == dto.Name.ToLower());
            if(isDuplicate)
            {
                return BadRequest("Department name already exists");
            }

            var department = new Department
            {
                Name = dto.Name
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            var result = new DepartmentGetDto
            {
                Id = department.Id,
                Name = department.Name
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] DepartmentCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingDepartment = await _context.Departments.FindAsync(id);
            if (existingDepartment == null) return NotFound();

            existingDepartment.Name = dto.Name;

            await _context.SaveChangesAsync();

            var result = new DepartmentGetDto
            {
                Id = existingDepartment.Id,
                Name = existingDepartment.Name
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if(department == null)
            {
                return NotFound();
            }

            bool hasEmployees = await _context.Employees.AnyAsync(e => e.DepartmentId == id);

            if (hasEmployees)
            {
                return BadRequest("This department has employees");
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
