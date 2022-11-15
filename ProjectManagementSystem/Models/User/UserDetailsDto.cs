using System;
using System.Collections.Generic;
using ProjectManagementSystem.Models.Misc;
using ProjectManagementSystem.Models.Project;

namespace ProjectManagementSystem.Models.User
{
    public class UserDetailsDto
    {
        public string Id { get; set; }
        public string UserCode { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public ImageDto Image { get; set; }
        public bool Disabled { get; set; }
        public string ProjectId { get; set; }
        public string ProjectAdvisorId { get; set; }
        public List<ProjectDetailsDto> ParticipatedProjects { get; set; }
        public List<ProjectDetailsDto> AdvisedProjects { get; set; }
        public UserDetailsDto()
        {
            this.ParticipatedProjects = new List<ProjectDetailsDto>();
            this.AdvisedProjects = new List<ProjectDetailsDto>();
        }
    }
}