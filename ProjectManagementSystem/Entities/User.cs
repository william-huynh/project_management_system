using Microsoft.AspNetCore.Identity;
using ProjectManagementSystem.Entities.Enum;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace ProjectManagementSystem.Entities
{
    public class User : IdentityUser
    {
        public string UserCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string Address { get; set; }
        public string ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
        public string ImageId { get; set; }
        [ForeignKey("ImageId")]
        public Image Image { get; set; }
        public bool Disable { get; set; } = false;
    }
}
