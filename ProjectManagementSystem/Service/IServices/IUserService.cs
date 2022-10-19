using System.Threading.Tasks;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.User;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IUserService
    {
        Task<UsersListDto> GetUsersListAsync(int? page, int? pageSize, string keyword, string[] roles, string sortField, string sortOrder);
        Task<UsersListDto> GetAvailableScrumMastersListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<UsersListDto> GetAvailableDevelopersListAsync(int? page, int? pageSize, string sortField, string sortOrder, string developer1Id, string developer2Id, string developer3Id, string developer4Id);
        Task<UserDetailsDto> GetUserDetailsAsync(string userId);
        Task<UserUpdateDetail> GetUserUpdateDetailsAsync(string userId);
        Task<User> CreateUserAsync(UserCreateDto model);
        Task<User> UpdateUserAsync(UserUpdateDto model);
        Task<User> DisableUserAsync(string userId);
    }
}