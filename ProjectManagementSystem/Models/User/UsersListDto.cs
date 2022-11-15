using System.Collections.Generic;

namespace ProjectManagementSystem.Models.User
{
    public class UsersListDto
    {
        public List<UserDetailsDto> Users { get; set; }
        public int TotalItem { get; set; }
        public int CurrentPage { get; set; }
        public double NumberPage { get; set; }
        public int? PageSize { get; set; }
        public UsersListDto()
        {
            this.Users = new List<UserDetailsDto>();
        }
    }
}