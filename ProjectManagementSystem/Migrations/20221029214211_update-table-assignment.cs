using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectManagementSystem.Migrations
{
    public partial class updatetableassignment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Projects_ProjectId",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_ProjectId",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Assignments");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectId",
                table: "Assignments",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_ProjectId",
                table: "Assignments",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Projects_ProjectId",
                table: "Assignments",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }
    }
}
