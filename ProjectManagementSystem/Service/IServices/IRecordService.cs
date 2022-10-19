using System.Threading.Tasks;
using ProjectManagementSystem.Entities;

namespace ProjectManagementSystem.Service.IServices
{
    public interface IRecordService
    {
        Task<Record> CreateRecordAsync(string userId, string projectId);
        Task<bool> RemoveRecordAsync(string userId);
    }
}