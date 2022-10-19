using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Service.IServices;

namespace ProjectManagementSystem.Service.Services
{
    public class RecordService : IRecordService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        public RecordService(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<Record> CreateRecordAsync(string userId, string projectId)
        {
            var record = new Record
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                ProjectId = projectId,
            };
            var createdRecord = _db.Records.Add(record);
            await _db.SaveChangesAsync();
            return record;
        }

        public async Task<bool> RemoveRecordAsync(string userId)
        {
            var record = await _db.Records.Where(x => x.UserId == userId).FirstOrDefaultAsync();
            _db.Records.Remove(record);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}