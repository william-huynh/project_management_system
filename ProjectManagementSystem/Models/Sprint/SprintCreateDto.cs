using System;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string ProjectId { get; set; }
    }
}
