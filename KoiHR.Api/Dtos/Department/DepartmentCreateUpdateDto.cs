using System.ComponentModel.DataAnnotations;

namespace KoiHR.Api.Dtos.Department
{
    public class DepartmentCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
    }
}
