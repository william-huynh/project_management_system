using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentsListDto
    {
        public List<AssignmentDetailsDto> Assignments { get; set; }
        public int TotalItem { get; set; }
        public int CurrentPage { get; set; }
        public double NumberPage { get; set; }
        public int? PageSize { get; set; }
        public AssignmentsListDto()
        {
            this.Assignments = new List<AssignmentDetailsDto>();
        }
    }
}
