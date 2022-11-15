using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Problem
{
    public class ProblemBoardDto
    {
        public List<ProblemDetailsDto> Todo { get; set; }
        public List<ProblemDetailsDto> InProgress { get; set; }
        public List<ProblemDetailsDto> InReview { get; set; }
        public ProblemBoardDto()
        {
            this.Todo = new List<ProblemDetailsDto>();
            this.InProgress = new List<ProblemDetailsDto>();
            this.InReview = new List<ProblemDetailsDto>();
        }
    }
}
