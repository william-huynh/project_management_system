using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentBoardDto
    {
        public List<AssignmentDetailsDto> Todo { get; set; }
        public List<AssignmentDetailsDto> InProgress { get; set; }
        public List<AssignmentDetailsDto> InReview { get; set; }
        public AssignmentBoardDto()
        {
            this.Todo = new List<AssignmentDetailsDto>();
            this.InProgress = new List<AssignmentDetailsDto>();
            this.InReview = new List<AssignmentDetailsDto>();
        }
    }
}
