﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ProjectManagementSystem.Data;

#nullable disable

namespace ProjectManagementSystem.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20221009164145_update-table-user-2")]
    partial class updatetableuser2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Assignment", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AssignmentCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CategoryId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DeveloperId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<DateTime>("EndedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Point")
                        .HasColumnType("int");

                    b.Property<string>("SprintId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("StartedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("DeveloperId");

                    b.HasIndex("SprintId");

                    b.ToTable("Assignments");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Category", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Comment", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AssignmentId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CommentContent")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<string>("ProblemId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Image", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AssociatedId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<string>("ImageName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Problem", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AssignmentId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("CategoryId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DeveloperId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<DateTime>("EndedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Point")
                        .HasColumnType("int");

                    b.Property<string>("ProblemCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SprintId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTime>("StartedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AssignmentId");

                    b.HasIndex("CategoryId");

                    b.HasIndex("DeveloperId");

                    b.HasIndex("SprintId");

                    b.ToTable("Problems");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Project", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("AdvisorId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<DateTime>("EndedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Iterations")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProjectCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Rating", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Attitude")
                        .HasColumnType("int");

                    b.Property<int>("Interaction")
                        .HasColumnType("int");

                    b.Property<int>("Management")
                        .HasColumnType("int");

                    b.Property<int>("Performance")
                        .HasColumnType("int");

                    b.Property<int>("Planning")
                        .HasColumnType("int");

                    b.Property<int>("ProblemSolving")
                        .HasColumnType("int");

                    b.Property<string>("RatingContent")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TimeManagement")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Ratings");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Sprint", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<DateTime>("EndedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("MaxPoint")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProjectId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("SprintCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartedDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Sprints");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<bool>("Disable")
                        .HasColumnType("bit");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Gender")
                        .HasColumnType("int");

                    b.Property<string>("ImageId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("ProjectId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("ImageId");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.HasIndex("ProjectId");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ProjectManagementSystem.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Assignment", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("ProjectManagementSystem.Entities.User", "Developer")
                        .WithMany()
                        .HasForeignKey("DeveloperId");

                    b.HasOne("ProjectManagementSystem.Entities.Sprint", "Sprint")
                        .WithMany()
                        .HasForeignKey("SprintId");

                    b.Navigation("Category");

                    b.Navigation("Developer");

                    b.Navigation("Sprint");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Comment", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Problem", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.Assignment", "Assignment")
                        .WithMany()
                        .HasForeignKey("AssignmentId");

                    b.HasOne("ProjectManagementSystem.Entities.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.HasOne("ProjectManagementSystem.Entities.User", "Developer")
                        .WithMany()
                        .HasForeignKey("DeveloperId");

                    b.HasOne("ProjectManagementSystem.Entities.Sprint", "Sprint")
                        .WithMany()
                        .HasForeignKey("SprintId");

                    b.Navigation("Assignment");

                    b.Navigation("Category");

                    b.Navigation("Developer");

                    b.Navigation("Sprint");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Rating", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.Sprint", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("ProjectManagementSystem.Entities.User", b =>
                {
                    b.HasOne("ProjectManagementSystem.Entities.Image", "Image")
                        .WithMany()
                        .HasForeignKey("ImageId");

                    b.HasOne("ProjectManagementSystem.Entities.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId");

                    b.Navigation("Image");

                    b.Navigation("Project");
                });
#pragma warning restore 612, 618
        }
    }
}
