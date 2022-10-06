using System.Collections.Generic;

namespace ProjectManagementSystem.Models.Misc
{
    public class UserModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public IList<string> Role { get; set; }
    }
}
