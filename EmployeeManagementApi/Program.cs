using EmployeeManagementApi.Extensions;
using EmployeeManagementApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.ConfigureCORS(builder.Configuration)
                .AddSwaggerExplorer()
                .InjectDbContext(builder.Configuration)
                .AddIdentityHandlersAndStores()
                .ConfigureIdentityOptions()
                .AddIdentityAuth(builder.Configuration);

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ISalaryEntryService, SalaryEntryService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<ILeaveApplicationService, LeaveApplicationService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IWeekendService, WeekendService>();

var app = builder.Build();

app.ConfigureSwaggerExplorer();
app.UseCORSConfiguration();
app.UseStaticFilesConfiguration();
app.UseHttpsRedirection();
app.AddIdentityAuthMiddlewares();

await app.SeedRolesAsync();
await app.SeedAdminUser();

app.MapControllers();

app.Run();
