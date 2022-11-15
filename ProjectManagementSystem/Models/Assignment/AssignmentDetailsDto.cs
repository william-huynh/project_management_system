using ProjectManagementSystem.Models.User;
using System;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentDetailsDto
    {
        public string Id { get; set; }
        public string AssignmentCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public int Point { get; set; }
        public string Status { get; set; }
        public string ProjectId { get; set; }
        public string SprintId { get; set; }
        public string SprintName { get; set; }
        public string DeveloperId { get; set; }
        public string DeveloperName { get; set; }
        public UserDetailsDto Developer { get; set; }
        public bool Disable { get; set; }
    }
}
