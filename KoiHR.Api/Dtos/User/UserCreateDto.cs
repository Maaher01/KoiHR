namespace KoiHR.Api.Dtos.User
{
    public class UserCreateDto
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public int? EmployeeId { get; set; }
    }
}
