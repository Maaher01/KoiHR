using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KoiHR.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAttendanceSettingsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EmployeeId",
                table: "AttendanceSettings",
                newName: "DepartmentId");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Attendances",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceSettings_DepartmentId",
                table: "AttendanceSettings",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceSettings_Departments_DepartmentId",
                table: "AttendanceSettings",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceSettings_Departments_DepartmentId",
                table: "AttendanceSettings");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceSettings_DepartmentId",
                table: "AttendanceSettings");

            migrationBuilder.RenameColumn(
                name: "DepartmentId",
                table: "AttendanceSettings",
                newName: "EmployeeId");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Attendances",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
