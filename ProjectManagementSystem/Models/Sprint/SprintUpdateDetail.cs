using System;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintUpdateDetail
    {
        public string Name { get; set; }
        public string MaxPoint { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public SprintDetailsDto OlderSprint { get; set; }
        public SprintDetailsDto NewerSprint { get; set; }
    }
}
