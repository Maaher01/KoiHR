using KoiHR.Api.Dtos.Employee.Experience;
using KoiHR.Api.Dtos.Employee.Qualification;
using KoiHR.Api.Dtos.Employee.Records;
using KoiHR.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EmployeeService(EmployeeDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<List<EmployeeGetDto>> GetEmployeesAsync()
        {
            return await _context.Employees.OrderBy(e => e.DateOfJoining)
                .Select(e => new EmployeeGetDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
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
        }

        public async Task<EmployeeGetDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Department)
                .Include(e => e.Experiences)
                .Include(e => e.Qualifications)
                .FirstOrDefaultAsync(e =>  e.Id == id);
            if (employee == null) return null;

            return new EmployeeGetDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                DepartmentId = employee.DepartmentId,
                DepartmentName = employee.Department?.Name,
                Experiences = employee.Experiences.Select(ex => new EmployeeExperienceGetDto
                {
                    Id = ex.Id,
                    CompanyName = ex.CompanyName,
                    Designation = ex.Designation,
                    StartDate = ex.StartDate,
                    EndDate = ex.EndDate
                }).ToList(),
                Qualifications = employee.Qualifications.Select(q => new EmployeeQualificationGetDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    Institution = q.Institution,
                    PassingYear = q.PassingYear,
                    Result = q.Result
                }).ToList(),
                DateOfJoining = employee.DateOfJoining,
                Image = employee.Image,
                Phone = employee.Phone,
                Address = employee.Address,
                DOB = employee.DOB,
                Gender = employee.Gender,
                Designation = employee.Designation,
                BasicSalary = employee.BasicSalary
            };
        }

        public async Task<(bool Success, string? Error, EmployeeGetDto? Result)> AddEmployeeAsync(EmployeeCreateUpdateDto dto)
        {
            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
            if (!departmentExists) return (false, "Department does not exist", null);

            var employee = new Employee
            {
                Name = dto.Name,
                Email = dto.Email,
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
                Email = employee.Email,
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

            return (true, null, result);
        }

        public async Task<(bool Success, string? Error, EmployeeGetDto? Result)> UpdateEmployeeAsync(int id, EmployeeCreateUpdateDto dto)
        {
            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null) return (false, "Employee does not exist", null);

            existingEmployee.Name = dto.Name;
            existingEmployee.Email = dto.Email;
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
                Email = existingEmployee.Email,
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

            return (true, null, result);
        }

        public async Task<bool> DeleteEmployeeByid(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;
           
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<string> SaveEmployeeImageAsync(IFormFile file)
        {
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

            return fileName;
        }

        public async Task<bool> UpdateEmployeeImageAsync(int id, string image)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            employee.Image = image;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
