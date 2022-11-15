namespace ProjectManagementSystem.Models.Project
{
    public class ProjectSummaryDto
    {
        public int Total { get; set; }
        public int Active { get; set; }
        public int Complete { get; set; }
        public int Owned { get; set; }
    }
}