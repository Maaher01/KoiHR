using EmployeeManagementApi.Dtos.Employee.Records;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmployeeManagementApi.Services;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
           _employeeService = employeeService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetEmployees() 
        { 
            var employees = await _employeeService.GetEmployeesAsync();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();

            return Ok(employee);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (success, error, result) = await _employeeService.AddEmployeeAsync(dto);
            if(!success) return BadRequest(error);

            return Ok(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeCreateUpdateDto dto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var (success, error, result) = await _employeeService.UpdateEmployeeAsync(id, dto);
            if(!success)
            {
                return error == "Employee not found" ? NotFound() : BadRequest(error);
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,HR")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var deleted = await _employeeService.DeleteEmployeeByid(id);
            if(!deleted) return NotFound();

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

                var fileName = await _employeeService.SaveEmployeeImageAsync(file);
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
            var updated = await _employeeService.UpdateEmployeeImageAsync(id, dto.Image);
            if(!updated) return NotFound();

            return Ok();
        }
    }
}