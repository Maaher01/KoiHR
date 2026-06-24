namespace KoiHR.Api.Dtos.User
{
    public class UserUpdateDto
    {
        public string? Email { get; set; }
        public string? NewPassword { get; set; }
        public string? Role { get; set; }
    }
}
