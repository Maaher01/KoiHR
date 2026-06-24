using KoiHR.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KoiHR.Api.Extensions
{
    public static class EFCoreExtensions
    {
        public static IServiceCollection InjectDbContext(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<KoiHRDbContext>(options =>
                options.UseSqlServer(config.GetConnectionString("EmployeeAppCon"))
            );
            //services.AddDbContext<KoiHRDbContext>(options =>
            //    options.UseInMemoryDatabase("TestDb")
            //);

            return services;
        }
    }
}