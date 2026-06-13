using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeManagementApi.Migrations
{
    /// <inheritdoc />
    public partial class AddedPaymentMethodToSalaryPaymentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PaymentMethod",
                table: "SalaryPayments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "SalaryPayments");
        }
    }
}
