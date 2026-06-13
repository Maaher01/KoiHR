using EmployeeManagementApi.Dtos.Employee;
using EmployeeManagementApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EmployeeController(EmployeeDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetEmployees() 
        { 
            var employees = await _context.Employees.OrderBy(e => e.DateOfJoining)
                .Select(e => new EmployeeGetDto
                {
                    Id = e.Id,
                    Name = e.Name!,
                    DepartmentId = e.DepartmentId,
                    DepartmentName = e.Department!.Name,
                    DateOfJoining = e.DateOfJoining,
                    Image = e.Image,
                    Phone = e.Phone,
                    Address = e.Address,
                    DOB = e.DOB,
                    Gender = e.Gender,
                    Designation = e.Designation,
                    BasicSalary = e.BasicSalary
                }).ToListAsync();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e =>  e.Id == id);
            if (employee == null) return NotFound();

            var result = new EmployeeGetDto
            {
                Id = employee.Id,
                Name = employee.Name!,
                DepartmentId = employee.DepartmentId,
                DepartmentName = employee.Department?.Name,
                DateOfJoining = employee.DateOfJoining,
                Image = employee.Image,
                Phone = employee.Phone,
                Address = employee.Address,
                DOB = employee.DOB,
                Gender = employee.Gender,
                Designation = employee.Designation,
                BasicSalary = employee.BasicSalary
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!departmentExists) return BadRequest("Department does not exist");

            var employee = new Employee
            {
                Name = dto.Name,
                DepartmentId = dto.DepartmentId,
                DateOfJoining = dto.DateOfJoining,
                Image = dto.Image,
                Phone = dto.Phone,
                Address = dto.Address,
                DOB = dto.DOB,
                Gender = dto.Gender,
                Designation = dto.Designation,
                BasicSalary = dto.BasicSalary
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            var result = new EmployeeGetDto
            {
                Id = employee.Id,
                Name = employee.Name,
                DepartmentId = employee.DepartmentId,
                DepartmentName = (await _context.Departments.FindAsync(employee.DepartmentId))?.Name,
                DateOfJoining = employee.DateOfJoining,
                Image = employee.Image,
                Phone = employee.Phone,
                Address = employee.Address,
                DOB = employee.DOB,
                Gender = employee.Gender,
                Designation = employee.Designation,
                BasicSalary = employee.BasicSalary
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeCreateUpdateDto dto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null) return NotFound();

            existingEmployee.Name = dto.Name;
            existingEmployee.DepartmentId = dto.DepartmentId;
            existingEmployee.DateOfJoining = dto.DateOfJoining;
            existingEmployee.Image = dto.Image;
            existingEmployee.Phone = dto.Phone;
            existingEmployee.Address = dto.Address;
            existingEmployee.DOB = dto.DOB;
            existingEmployee.Gender = dto.Gender;
            existingEmployee.Designation = dto.Designation;
            existingEmployee.BasicSalary = dto.BasicSalary;

            await _context.SaveChangesAsync();

            var result = new EmployeeGetDto
            {
                Id = existingEmployee.Id,
                Name = existingEmployee.Name,
                DepartmentId = existingEmployee.DepartmentId,
                DepartmentName = (await _context.Departments.FindAsync(existingEmployee.DepartmentId))?.Name,
                DateOfJoining = existingEmployee.DateOfJoining,
                Image = existingEmployee.Image,
                Phone = existingEmployee.Phone,
                Address = existingEmployee.Address,
                DOB = existingEmployee.DOB,
                Gender = existingEmployee.Gender,
                Designation = existingEmployee.Designation,
                BasicSalary = existingEmployee.BasicSalary
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if(employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Route("UploadImage")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var file = Request.Form.Files.FirstOrDefault();

                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                var folderPath = Path.Combine(_env.ContentRootPath, "Photos");

                // Ensure folder exists
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error uploading file: " + ex.Message);
            }
        }

        [HttpPatch("{id}/image")]
        [Authorize]
        public async Task<IActionResult> UpdateImage(int id, [FromBody] EmployeeImageUpdateDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if(employee == null) return NotFound();

            employee.Image = dto.Image;
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
