using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Sprint;
using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentFilterListDto
    {
        public List<SprintFilterDto> Sprints { get; set; }
        public List<CategoryFilterDto> Categories { get; set; }
        public AssignmentFilterListDto()
        {
            this.Sprints = new List<SprintFilterDto>();
            this.Categories = new List<CategoryFilterDto>();
        }
    }
}
