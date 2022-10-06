using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagementSystem.Entities
{
    public class Comment
    {
        public string Id { get; set; }
        public string CommentContent { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public string AssignmentId { get; set; }
        public string ProblemId { get; set; }
        public bool Disable { get; set; } = false;
    }
}
