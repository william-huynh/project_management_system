using ProjectManagementSystem.Entities.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Entities
{
    public class Problem
    {
        public string Id { get; set; }
        public string ProblemCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public int Point { get; set; }
        public Status Status { get; set; }
        public string AssignmentId { get; set; }
        [ForeignKey("AssignmentId")]
        public Assignment Assignment { get; set; }
        public string SprintId { get; set; }
        [ForeignKey("SprintId")]
        public Sprint Sprint { get; set; }
        public string DeveloperId { get; set; }
        [ForeignKey("DeveloperId")]
        public User Developer { get; set; }
        public bool Disable { get; set; } = false;
    }
}
