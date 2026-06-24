using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KoiHR.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLeaveDaysFromSalaryEntryTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LeaveDays",
                table: "SalaryEntries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LeaveDays",
                table: "SalaryEntries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
