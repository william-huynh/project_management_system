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
            var productOwner = new User()
            {
                UserName = "advisor",
                NormalizedUserName = "advisor",
                Email = "advisor@gmail.com",
                NormalizedEmail = "advisor@gmail.com",
                FirstName = "Advisor",
                LastName = "Root",
                DateOfBirth = new DateTime(1999, 01, 01),
                Disable = false,
                Gender = Gender.Male,
            };

            var scrumMaster = new User()
            {
                UserName = "scrumMaster",
                NormalizedUserName = "scrumMaster",
                Email = "scrumMaster@gmail.com",
                NormalizedEmail = "scrumMaster@gmail.com",
                FirstName = "Scrum",
                LastName = "Master",
                DateOfBirth = new DateTime(1999, 01, 01),
                Disable = false,
                Gender = Gender.Male,
            };

            var developer = new User()
            {
                UserName = "developer",
                NormalizedUserName = "developer",
                Email = "developer@gmail.com",
                NormalizedEmail = "developer@gmail.com",
                FirstName = "Developer",
                LastName = "Root",
                DateOfBirth = new DateTime(1999, 01, 01),
                Disable = false,
                Gender = Gender.Male,
            };

            _roleManager.CreateAsync(new IdentityRole("ProductOwner")).GetAwaiter().GetResult();
            _roleManager.CreateAsync(new IdentityRole("ScrumMaster")).GetAwaiter().GetResult();
            _roleManager.CreateAsync(new IdentityRole("Developer")).GetAwaiter().GetResult();

            _userManager.CreateAsync(productOwner, "Advisor@root123").GetAwaiter().GetResult();
            _userManager.CreateAsync(scrumMaster, "Scrum@master123").GetAwaiter().GetResult();
            _userManager.CreateAsync(developer, "Developer@root123").GetAwaiter().GetResult();

            var roleProductOwner = _roleManager.FindByNameAsync("ProductOwner").GetAwaiter().GetResult();
            var roleScrumMaster = _roleManager.FindByNameAsync("ScrumMaster").GetAwaiter().GetResult();
            var roleDeveloper = _roleManager.FindByNameAsync("Developer").GetAwaiter().GetResult();

            _userManager.AddToRoleAsync(productOwner, roleProductOwner.Name).GetAwaiter().GetResult();
            _userManager.AddToRoleAsync(scrumMaster, roleScrumMaster.Name).GetAwaiter().GetResult();
            _userManager.AddToRoleAsync(developer, roleDeveloper.Name).GetAwaiter().GetResult();
        }
    }
}