using System;
using ProjectManagementSystem.Models.Misc;
using ProjectManagementSystem.Models.Project;

namespace ProjectManagementSystem.Models.User
{
    public class UserDetailsDto
    {
        public string Id { get; set; }
        public string UserCode { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public ProjectDetailsDto Project { get; set; }
        public ImageDto Image { get; set; }
        public bool Disabled { get; set; }
    }
}