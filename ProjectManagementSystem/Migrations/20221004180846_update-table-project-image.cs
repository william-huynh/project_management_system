using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectManagementSystem.Migrations
{
    public partial class updatetableprojectimage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Ratings",
                newName: "RatingContent");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Images",
                newName: "ImageName");

            migrationBuilder.RenameColumn(
                name: "URL",
                table: "Images",
                newName: "AssociatedId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RatingContent",
                table: "Ratings",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "ImageName",
                table: "Images",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "AssociatedId",
                table: "Images",
                newName: "URL");

            migrationBuilder.AddColumn<int>(
                name: "Duration",
                table: "Projects",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
