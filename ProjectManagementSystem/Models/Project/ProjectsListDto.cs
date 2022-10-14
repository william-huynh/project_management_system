using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Project
{
    public class ProjectsListDto
    {
        public List<ProjectDetailsDto> Projects { get; set; }
        public int TotalItem { get; set; }
        public int CurrentPage { get; set; }
        public double NumberPage { get; set; }
        public int? PageSize { get; set; }
        public ProjectsListDto()
        {
            this.Projects = new List<ProjectDetailsDto>();
        }
    }
}