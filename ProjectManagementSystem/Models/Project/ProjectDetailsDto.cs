using System;
using ProjectManagementSystem.Entities.Enum;

namespace ProjectManagementSystem.Models.Project
{
    public class ProjectDetailsDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public Status Status { get; set; }
        public int Iterations { get; set; }
        public string AdvisorId { get; set; }
        public bool Disable { get; set; } = false;
    }
}