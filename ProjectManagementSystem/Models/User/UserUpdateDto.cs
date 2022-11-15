using System;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Misc;

namespace ProjectManagementSystem.Models.User
{
    public class UserUpdateDto
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
    }
}