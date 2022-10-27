using System;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintDetailsDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string MaxPoint { get; set; }
        public string Status { get; set; }
    }
}
