using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Sprint
{
    public class SprintsListDto
    {
        public List<SprintDetailsDto> Sprints { get; set; }
        public int TotalItem { get; set; }
        public int CurrentPage { get; set; }
        public double NumberPage { get; set; }
        public int? PageSize { get; set; }
        public SprintsListDto()
        {
            this.Sprints = new List<SprintDetailsDto>();
        }
    }
}
