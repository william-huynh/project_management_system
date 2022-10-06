using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectManagementSystem.Migrations
{
    public partial class updatetablecommentratingproblem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Assignments_TaskId",
                table: "Problems");

            migrationBuilder.DropColumn(
                name: "Disable",
                table: "Ratings");

            migrationBuilder.RenameColumn(
                name: "TaskId",
                table: "Problems",
                newName: "AssignmentId");

            migrationBuilder.RenameIndex(
                name: "IX_Problems_TaskId",
                table: "Problems",
                newName: "IX_Problems_AssignmentId");

            migrationBuilder.RenameColumn(
                name: "TaskId",
                table: "Comments",
                newName: "AssignmentId");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Ratings",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Ratings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_UserId",
                table: "Ratings",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Assignments_AssignmentId",
                table: "Problems",
                column: "AssignmentId",
                principalTable: "Assignments",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Ratings_AspNetUsers_UserId",
                table: "Ratings",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Problems_Assignments_AssignmentId",
                table: "Problems");

            migrationBuilder.DropForeignKey(
                name: "FK_Ratings_AspNetUsers_UserId",
                table: "Ratings");

            migrationBuilder.DropIndex(
                name: "IX_Ratings_UserId",
                table: "Ratings");

            migrationBuilder.DropColumn(
                name: "Content",
                table: "Ratings");

            migrationBuilder.RenameColumn(
                name: "AssignmentId",
                table: "Problems",
                newName: "TaskId");

            migrationBuilder.RenameIndex(
                name: "IX_Problems_AssignmentId",
                table: "Problems",
                newName: "IX_Problems_TaskId");

            migrationBuilder.RenameColumn(
                name: "AssignmentId",
                table: "Comments",
                newName: "TaskId");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Ratings",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Disable",
                table: "Ratings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_Problems_Assignments_TaskId",
                table: "Problems",
                column: "TaskId",
                principalTable: "Assignments",
                principalColumn: "Id");
        }
    }
}
