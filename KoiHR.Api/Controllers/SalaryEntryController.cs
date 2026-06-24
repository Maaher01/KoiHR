using Microsoft.AspNetCore.Mvc;
using KoiHR.Api.Services;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalaryEntryController : ControllerBase
    {
        private readonly ISalaryEntryService _salaryEntryService;

        public SalaryEntryController(ISalaryEntryService salaryEntryService)
        {
            _salaryEntryService = salaryEntryService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateSalaryEntries([FromQuery] int month, [FromQuery] int year)
        {
            var (success, error, result) = await _salaryEntryService.GenerateSalaryEntriesAsync(month, year);
            if (!success)
            {
                if (error!.Contains("already been generated")) return Conflict(error);
                return BadRequest(error);
            }

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetSalaryEntries([FromQuery] int month, [FromQuery] int year)
        {
            var result = await _salaryEntryService.GetSalaryEntriesAsync(month, year);

            return Ok(result);
        }
    }
}
