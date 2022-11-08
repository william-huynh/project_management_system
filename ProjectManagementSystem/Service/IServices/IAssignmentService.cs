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
        Task<List<CategoryDetailsDto>> GetCategoriesListAsync(string userId);
        Task<Category> CreateCategoryAsync(CategoryCreateDto model);
        Task<List<SprintDetailsDto>> GetSprintsListAsync(string userId);
        Task<AssignmentFilterListDto> GetFilterListAsync(string userId);
        Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder);
        Task<AssignmentsListDto> GetAssignmentsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId);
        Task<AssignmentsListDto> GetAssignedAssignmentsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId);
        Task<AssignmentBoardDto> GetBoardAssignmentsListAsync(string userId);
        Task<AssignmentDetailsDto> GetAssignmentDetailAsync(string assignmentId);
        Task<AssignmentUpdateDetail> GetAssignmentUpdateDetailAsync(string assignmentId);
        Task<Assignment> UpdateAssignmentAsync(AssignmentUpdateDto model);
        Task<Assignment> AcceptAssignmentAsync(string assignmentId);
        Task<Assignment> UpdateAssignmentStatusAsync(string assignmentId, string status);
        Task<Assignment> CreateAssignmentAsync(AssignmentCreateDto model);
        Task<Assignment> DisableAssignmentAsync(string assignmentId);
    }
}
