using KoiHR.Api.Dtos.Holiday;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,HR")]
    public class HolidayController : ControllerBase
    {
        private readonly KoiHRDbContext _context;

        public HolidayController(KoiHRDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHolidays()
        {
            var holidays = await _context.Holidays.ToListAsync();

            return Ok(holidays);
        }

        [HttpPost]
        public async Task<IActionResult> AddHoliday([FromBody] HolidayCreateUpdateDto dto)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var holiday = new Holiday
            {
                Name = dto.Name,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate
            };

            _context.Holidays.Add(holiday);
            await _context.SaveChangesAsync();

            return Ok(holiday);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHoliday(int id, [FromBody] HolidayCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingHoliday = await _context.Holidays.FindAsync(id);
            if (existingHoliday == null) return NotFound();

            existingHoliday.Name = dto.Name;
            existingHoliday.StartDate = dto.StartDate;
            existingHoliday.EndDate = dto.EndDate;

            await _context.SaveChangesAsync();

            return Ok(existingHoliday);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoliday(int id)
        {
            var holiday = await _context.Holidays.FindAsync(id);
            if (holiday == null) return NotFound();

            _context.Holidays.Remove(holiday);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
