using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Problem;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IProblemService
    {
        Task<List<CategoryDetailsDto>> GetCategoriesListAsync(string userId);
        Task<Category> CreateCategoryAsync(CategoryCreateDto model);
        Task<List<SprintDetailsDto>> GetSprintsListAsync(string userId);
        Task<AssignmentFilterListDto> GetFilterListAsync(string userId);
        Task<AssignmentsListDto> GetAvailableAssignmentsListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<ProblemsListDto> GetProblemsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId);
        Task<ProblemUpdateDetail> GetProblemUpdateDetailAsync(string ProblemId);
        Task<ProblemDetailsDto> GetProblemDetailAsync(string problemId);
        Task<Problem> UpdateProblemAsync(ProblemUpdateDto model);
        Task<Problem> CreateProblemAsync(ProblemCreateDto model);
        Task<Problem> DisableProblemAsync(string ProblemId);
    }
}
