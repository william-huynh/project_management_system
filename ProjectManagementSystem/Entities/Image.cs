namespace ProjectManagementSystem.Entities
{
    public class Image
    {
        public string Id { get; set; }
        public string URL { get; set; }
        public string UserId { get; set; }
        public bool Disable { get; set; } = false;
    }
}
