using EmployeeManagementApi.Dtos.Leave.Applications;
using EmployeeManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveApplicationController : ControllerBase
    {
        private readonly ILeaveApplicationService _leaveApplicationService;

        public LeaveApplicationController(ILeaveApplicationService leaveApplicationService)
        {
            _leaveApplicationService = leaveApplicationService;
        }

        [HttpGet]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> GetAllLeaveApplications()
        {
            var allLeaveApps = await _leaveApplicationService.GetAllLeaveApplicationsAsync();

            return Ok(allLeaveApps);
        }

        [HttpGet("employee")]
        [Authorize(Roles = "Employee,HR")]
        public async Task<IActionResult> GetLeaveApplicationsByEmployee()
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var (success, error, applications) = await _leaveApplicationService.GetLeaveApplicationsByEmployeeAsync(userId);
            if (!success) return NotFound(error);

            return Ok(applications);
        }

        [HttpPost]
        [Authorize(Roles = "Employee,HR")]
        public async Task<IActionResult> CreateLeaveApplication([FromBody] LeaveApplicationCreateDto dto)
        {
            var userId = User.FindFirstValue("uid");
            if (userId == null) return Unauthorized("User not found in token");

            var (success, error, result) = await _leaveApplicationService.CreateLeaveApplicationAsync(userId, dto);
            if(!success)
            {
                if(error!.Contains("not found")) return NotFound(error);
                if(error!.Contains("overlaps")) return Conflict(error);
                return BadRequest(error);
            }

            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles ="HR,Admin")]
        public async Task<IActionResult> UpdateLeaveStatus(int id, [FromBody] LeaveStatusUpdateDto dto)
        {
            var (success, error) = await _leaveApplicationService.UpdateLeaveStatusAsync(id, dto);
            if(!success)
            {
                if (error!.Contains("not found")) return NotFound(error);
                return BadRequest(error);
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteLeaveApplication(int id)
        {
            var (success, error) = await _leaveApplicationService.DeleteLeaveApplicationAsync(id);
            if(!success) return NotFound(error);

            return NoContent();
        }
    }
}