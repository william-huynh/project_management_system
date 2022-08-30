using Microsoft.AspNetCore.Identity;
using ProjectManagementSystem.Entities.Enum;
using System;

namespace ProjectManagementSystem.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public bool Disable { get; set; } = false;
    }
}
