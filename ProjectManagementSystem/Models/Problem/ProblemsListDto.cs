using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Problem
{
    public class ProblemsListDto
    {
        public List<ProblemDetailsDto> Problems { get; set; }
        public int TotalItem { get; set; }
        public int CurrentPage { get; set; }
        public double NumberPage { get; set; }
        public int? PageSize { get; set; }
        public ProblemsListDto()
        {
            this.Problems = new List<ProblemDetailsDto>();
        }
    }
}
