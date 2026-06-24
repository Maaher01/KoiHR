using KoiHR.Api.Dtos.Weekend;
using KoiHR.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class WeekendController : ControllerBase
    {
        private readonly IWeekendService _weekendService;

        public WeekendController(IWeekendService weekendService)
        {
            _weekendService = weekendService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartmentWeekends()
        {
            var result = await _weekendService.GetAllDepartmentWeekendsAsync();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> SetWeekend([FromBody] WeekendAddDto dto)
        {
            await _weekendService.SetWeekendAsync(dto);

            return Ok();
        }
    }
}
