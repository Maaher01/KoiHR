using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public ProfileController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirstValue("uid");
            var user = await _context.Users
                .Include(u => u.Employee)
                .ThenInclude(e => e.Department)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if(user == null) return NotFound();

            var result = new
            {
                email = user.Email,
                employeeId = user.EmployeeId,
                name = user.Employee?.Name,
                department = user.Employee?.Department?.Name,
                dateOfJoining = user.Employee?.DateOfJoining,
                image = user.Employee?.Image
            };

            return Ok(result);
        }
    }
}
