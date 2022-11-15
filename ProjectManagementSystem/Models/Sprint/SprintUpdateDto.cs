using System;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintUpdateDto
    {
        public string Id { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public int MaxPoint { get; set; }
    }
}
