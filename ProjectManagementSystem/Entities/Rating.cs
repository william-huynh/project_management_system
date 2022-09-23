namespace ProjectManagementSystem.Entities
{
    public class Rating
    {
        public string Id { get; set; }
        public int Performance { get; set; }
        public int Attitude { get; set; }
        public int Interaction { get; set; }
        public int TimeManagement { get; set; }
        public int ProblemSolving { get; set; }
        public int Planning { get; set; }
        public int Management { get; set; }
        public string UserId { get; set; }
        public bool Disable { get; set; } = false;
    }
}
