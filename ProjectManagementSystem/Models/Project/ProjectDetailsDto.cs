using System;
using System.Collections.Generic;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.User;

namespace ProjectManagementSystem.Models.Project
{
    public class ProjectDetailsDto
    {
        public string Id { get; set; }
        public string ProjectCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string Status { get; set; }
        public int Iterations { get; set; }
        public string AdvisorName { get; set; }
        public UserDetailsDto Advisor { get; set; }
        public bool Disable { get; set; }
        public UserDetailsDto ScrumMaster { get; set; }
        public List<UserDetailsDto> Developers { get; set; }
        public ProjectDetailsDto()
        {
            this.Developers = new List<UserDetailsDto>();
        }
    }
}