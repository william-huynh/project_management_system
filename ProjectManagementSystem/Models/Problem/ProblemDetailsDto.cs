using System;

namespace ProjectManagementSystem.Models.Problem
{
    public class ProblemDetailsDto
    {
        public string Id { get; set; }
        public string ProblemCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public int Point { get; set; }
        public string Status { get; set; }
        public string AssignmentId { get; set; }
        public string SprintId { get; set; }
        public string SprintName { get; set; }
        public string DeveloperId { get; set; }
        public bool Disable { get; set; }
    }
}
