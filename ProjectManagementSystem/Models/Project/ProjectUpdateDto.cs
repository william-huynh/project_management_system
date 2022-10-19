using System;

namespace ProjectManagementSystem.Models.Project
{
    public class ProjectUpdateDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string ScrumMasterId { get; set; }
        public string Developer1Id { get; set; }
        public string Developer2Id { get; set; }
        public string Developer3Id { get; set; }
        public string Developer4Id { get; set; }
    }
}
