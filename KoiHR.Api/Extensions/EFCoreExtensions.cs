using KoiHR.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Extensions
{
    public static class EFCoreExtensions
    {
        public static IServiceCollection InjectDbContext(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<EmployeeDbContext>(options =>
                options.UseSqlServer(config.GetConnectionString("EmployeeAppCon"))
            );
            //services.AddDbContext<EmployeeDbContext>(options =>
            //    options.UseInMemoryDatabase("TestDb")
            //);

            return services;
        }
    }
}