using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Sprint;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Service.IServices
{
    public interface ISprintService
    {
        Task<SprintsListDto> GetSprintsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder, string userId);
        Task<SprintDetailsDto> GetUpdateSprintDetailsAsync(string sprintId);
        Task<SprintCreateDetail> GetProjectSprintDetail(string userId);
        Task<Sprint> CreateSprintAsync(SprintCreateDto model);
        Task<Sprint> UpdateSprintAsync(SprintUpdateDto model);
        Task<Sprint> DisableSprintAsync(string sprintId);
    }
}
