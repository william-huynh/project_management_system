using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Entities
{
    public class Record
    {
        public string Id { get; set; }
        public string RatingContent { get; set; }
        public int Performance { get; set; }
        public int Attitude { get; set; }
        public int Interaction { get; set; }
        public int TimeManagement { get; set; }
        public int ProblemSolving { get; set; }
        public int Planning { get; set; }
        public int Management { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public string ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }
}
