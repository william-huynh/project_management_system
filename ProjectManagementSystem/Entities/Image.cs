namespace ProjectManagementSystem.Entities
{
    public class Image
    {
        public string Id { get; set; }
        public string ImageName { get; set; }
        public string AssociatedId { get; set; }
        public bool Disable { get; set; } = false;
    }
}
