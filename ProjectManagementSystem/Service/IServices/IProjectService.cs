using System.Threading.Tasks;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Project;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IProjectService
    {
        Task<ProjectsListDto> GetProjectsListAsync(int? page, int? pageSize, string[] status, string advisorId);
        Task<ProjectsListDto> GetManageProjectsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder, string advisorId);
        Task<ProjectDetailsDto> GetProjectDashboardDetailsAsync(string projectId);
        Task<ProjectSummaryDto> GetProjectSummaryAsync(string advisorId);
        Task<Project> CreateProjectAsync(ProjectWriteDto model);
        Task<ProjectDetailsDto> GetProjectUpdateDetailAsync(string projectId);
        Task<Project> UpdateProjectAsync(ProjectWriteDto model);
        Task<Project> DisableProjectAsync(string projectId);
    }
}