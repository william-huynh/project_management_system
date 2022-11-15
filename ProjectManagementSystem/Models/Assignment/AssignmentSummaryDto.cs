using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Assignment
{
    public class AssignmentSummaryDto
    {
        public int ProductBacklog { get; set; }
        public int Backlog { get; set; }
        public int Pending { get; set; }
        public int Todo { get; set; }
        public int InProgress { get; set; }
        public int InReview { get; set; }
        public int Complete { get; set; }
    }
}
