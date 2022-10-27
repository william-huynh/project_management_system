using ProjectManagementSystem.Entities.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Entities
{
    public class Assignment
    {
        public string Id { get; set; }
        public string AssignmentCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Category Category { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public int Point { get; set; }
        public Status Status { get; set; }
        public string ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
        public string SprintId { get; set; }
        [ForeignKey("SprintId")]
        public Sprint Sprint { get; set; }
        public string DeveloperId { get; set; }
        [ForeignKey("DeveloperId")]
        public User Developer { get; set; }
        public bool Disable { get; set; } = false;
    }
}
