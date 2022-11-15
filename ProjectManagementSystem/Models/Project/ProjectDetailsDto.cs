using System;
using System.Collections.Generic;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Sprint;
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
        public string AdvisorName { get; set; }
        public int TotalSprintsNumber { get; set; }
        public int TotalAssignmentsNumber { get; set; }
        public int TotalProblemsNumber { get; set; }
        public int TotalCompleteNumber { get; set; }
        public UserDetailsDto Advisor { get; set; }
        public string ScrumMasterId { get; set; }
        public string ScrumMasterName { get; set; }
        public UserDetailsDto ScrumMaster { get; set; }
        public List<UserDetailsDto> Developers { get; set; }
        public List<SprintDetailsDto> Sprints { get; set; }
        public List<UserDetailsDto> AssignedDevelopers { get; set; }
        public AssignmentSummaryDto Assignment { get; set; }
        public AssignmentSummaryDto Problem { get; set; }
        public bool Disable { get; set; }
        public ProjectDetailsDto()
        {
            this.Developers = new List<UserDetailsDto>();
            this.AssignedDevelopers = new List<UserDetailsDto>();
        }
    }
}