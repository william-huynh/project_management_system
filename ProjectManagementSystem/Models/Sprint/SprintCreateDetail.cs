using ProjectManagementSystem.Models.Project;
using System;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintCreateDetail
    {
        public ProjectDetailsDto Project { get; set; }
        public string SprintCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string Status { get; set; }
    }
}
