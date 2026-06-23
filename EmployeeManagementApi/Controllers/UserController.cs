using EmployeeManagementApi.Dtos.User;
using EmployeeManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _userService.GetUsersAsync();
              
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UserCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var callerRole = User.FindFirstValue(ClaimTypes.Role);

            var (success, error, result) = await _userService.AddUserAsync(callerRole, dto);
            if(!success)
            {
                if (error!.Contains("already exists")) return Conflict(error);
                if (error.Contains("not allowed") || error.Contains("only allowed")) return Forbid();
                return BadRequest(error);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserUpdateDto dto)
        {
            var (success, error) = await _userService.UpdateUserAsync(id, dto);
            if(!success)
            {
                if (error!.Contains("not found")) return NotFound(error);
                if (error.Contains("already in use")) return Conflict(error);
                return BadRequest(error);
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var (success, error) = await _userService.DeleteUserAsync(id);
            if (!success) return NotFound(error); 

            return NoContent();
        }
    }
}
