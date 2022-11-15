namespace ProjectManagementSystem.Models.Misc
{
    public class ImageDto
    {
        public string Id { get; set; }
        public string ImageName { get; set; }
        public string AssociatedId { get; set; }
        public bool Disable { get; set; } = false;
    }
}