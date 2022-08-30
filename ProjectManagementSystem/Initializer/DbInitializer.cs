using Microsoft.AspNetCore.Identity;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using System;
using System.Linq;

namespace ProjectManagementSystem.Initializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public DbInitializer(ApplicationDbContext db, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public void Initialize()
        {
            //var projectOwner = new User()
            //{
            //    UserName = "advisor",
            //    NormalizedUserName = "advisor",
            //    Email = "advisor@gmail.com",
            //    NormalizedEmail = "advisor@gmail.com",
            //    FirstName = "Advisor",
            //    LastName = "Root",
            //    DateOfBirth = new DateTime(1999, 01, 01),
            //    Disable = false,
            //    Gender = Gender.Male,
            //};

            //_roleManager.CreateAsync(new IdentityRole("ProjectOwner")).GetAwaiter().GetResult();
            //_roleManager.CreateAsync(new IdentityRole("ScrumMaster")).GetAwaiter().GetResult();
            //_roleManager.CreateAsync(new IdentityRole("Developer")).GetAwaiter().GetResult();

            //_userManager.CreateAsync(projectOwner, "Advisor@root123").GetAwaiter().GetResult();

            //var roleAdmin = _roleManager.FindByNameAsync("ProjectOwner").GetAwaiter().GetResult();
            //_userManager.AddToRoleAsync(projectOwner, roleAdmin.Name).GetAwaiter().GetResult();
        }
    }
}