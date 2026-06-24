using KoiHR.Api.Dtos.Notice;
using KoiHR.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;

        public NoticeController(EmployeeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotices()
        {
            var notices = await _context.Notices.ToListAsync();

            return Ok(notices);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNoticeById(int id)
        {
            var notice = await _context.Notices
                .FirstOrDefaultAsync(e => e.Id == id);
            if (notice == null) return NotFound();

            var result = new Notice
            {
                Id = notice.Id,
                Title = notice.Title,
                Content = notice.Content,
                PublishedAt = notice.PublishedAt
            };

            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> AddNotice([FromBody] NoticeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var notice = new Notice
            {
                Title = dto.Title,
                Content = dto.Content
            };

            _context.Notices.Add(notice);
            await _context.SaveChangesAsync();

            return Ok(notice);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> UpdateNotice(int id, [FromBody] NoticeCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var notice = await _context.Notices.FindAsync(id);
            if (notice == null) return NotFound();

            notice.Title = dto.Title;
            notice.Content = dto.Content;

            await _context.SaveChangesAsync();

            return Ok(notice);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "HR,Admin")]
        public async Task<IActionResult> DeleteNotice(int id)
        {
            var notice = await _context.Notices.FindAsync(id);
            if (notice == null) return NotFound("Notice not found");

            _context.Notices.Remove(notice);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
 