using ProjectManagementSystem.Entities.Enum;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Entities
{
    public class Sprint
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public Status Status { get; set; }
        public int MaxPoint { get; set; }
        public string ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
        public bool Disable { get; set; } = false;
    }
}
