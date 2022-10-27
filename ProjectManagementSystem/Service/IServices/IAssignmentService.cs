using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IAssignmentService
    {
        Task<List<CategoryDetailsDto>> GetCategoriesListAsync();
        Task<Category> CreateCategoryAsync(CategoryCreateDto model);
        Task<List<SprintDetailsDto>> GetSprintsListAsync();
        Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<AssignmentsListDto> GetAssignmentsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId);
        Task<Assignment> CreateAssignmentAsync(AssignmentCreateDto model);
    }
}
