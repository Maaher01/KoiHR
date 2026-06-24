using KoiHR.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace KoiHR.Api.Extensions
{
    public static class DataSeederExtensions
    {
        public static async Task SeedRolesAsync(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string[] roles = ["Admin", "HR", "Employee"];
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

        public static async Task SeedAdminUser(this IApplicationBuilder app)
        {
            using(var scope = app.ApplicationServices.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                if(!await roleManager.RoleExistsAsync("Admin"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                }

                var adminUser = await userManager.FindByEmailAsync("admin@example.com");
                if (adminUser == null)
                {
                    var newAdmin = new AppUser { UserName = "Admin", Email = "admin@example.com", EmployeeId = null };
                    await userManager.CreateAsync(newAdmin, "Abc@123");
                    await userManager.AddToRoleAsync(newAdmin, "Admin");
                }
            }
        } 
    }
}
