using System;

namespace ProjectManagementSystem.Entities
{
    public class Category
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool Disable { get; set; } = false;
    }
}
