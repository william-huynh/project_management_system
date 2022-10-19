using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ProjectManagementSystem.Entities;

namespace ProjectManagementSystem.Models.Project
{
    public class ProjectUpdateDetail
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartedDate { get; set; }
        public DateTime EndedDate { get; set; }
        public string ScrumMasterId { get; set; }
        public string ScrumMasterName { get; set; }
        public List<ProjectUpdateUsers> Developers { get; set; }
        public ProjectUpdateDetail()
        {
            this.Developers = new List<ProjectUpdateUsers>();
        }
    }
}
