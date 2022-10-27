using ProjectManagementSystem.Models.Project;
using System;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintCreateDetail
    {
        public string Name { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
    }
}
