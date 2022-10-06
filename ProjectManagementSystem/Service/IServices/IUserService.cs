using System.Threading.Tasks;
using ProjectManagementSystem.Models.User;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IUserService
    {
        Task<UsersListDto> GetUsersListAsync(int? page, int? pageSize, string keyword, string[] roles, string sortField, string sortOrder);
    }
}