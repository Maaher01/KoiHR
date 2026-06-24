using Microsoft.AspNetCore.Identity;

namespace KoiHR.Api.Models
{
    public class AppUser:IdentityUser
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}
