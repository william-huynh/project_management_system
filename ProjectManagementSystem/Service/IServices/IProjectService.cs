using System.Threading.Tasks;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Project;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IProjectService
    {
        Task<ProjectsListDto> GetProjectsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder);
        Task<ProjectDetailsDto> GetProjectDetailsAsync(string projectId);
        Task<Project> CreateProjectAsync(ProjectCreateDto model);
        Task<ProjectUpdateDetail> GetProjectUpdateDetailAsync(string projectId);
        Task<Project> UpdateProjectAsync(ProjectUpdateDto model);
        Task<Project> DisableProjectAsync(string projectId);
    }
}