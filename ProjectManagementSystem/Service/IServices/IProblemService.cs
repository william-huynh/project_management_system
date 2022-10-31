using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Problem;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectManagementSystem.Models.Assignment;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IProblemService
    {
        Task<List<CategoryDetailsDto>> GetCategoriesListAsync();
        Task<Category> CreateCategoryAsync(CategoryCreateDto model);
        Task<List<SprintDetailsDto>> GetSprintsListAsync();
        Task<AssignmentsListDto> GetAvailableAssignmentsListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<ProblemsListDto> GetProblemsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId);
        Task<ProblemUpdateDetail> GetProblemUpdateDetailAsync(string ProblemId);
        Task<Problem> UpdateProblemAsync(ProblemUpdateDto model);
        Task<Problem> CreateProblemAsync(ProblemCreateDto model);
        Task<Problem> DisableProblemAsync(string ProblemId);
    }
}
