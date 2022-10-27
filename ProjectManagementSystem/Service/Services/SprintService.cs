using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Project;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Service.IServices;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Service.Services
{
    public class SprintService : ISprintService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public SprintService(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<SprintsListDto> GetSprintsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder, string userId)
        {
            if (status.Length == 0)
            {
                status = new string[] { "All" };
            }

            var querySprintsDetailsDto = _db.Sprints
                .Where(
                    x => x.Disable == false && x.ProjectId == _db.Records.Where(r => r.UserId == userId && r.Project.Status == Status.Active).FirstOrDefault().ProjectId
                ).OrderBy(x => x.Name)
                .Select(x => new SprintDetailsDto
                {
                    Id = x.Id,
                    MaxPoint = x.MaxPoint.ToString(),
                    Name = x.Name,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Status = ((Status)x.Status).ToString(),
                });

            if (querySprintsDetailsDto != null)
            {
                // SORT NAME
                if (sortOrder == "descend" && sortField == "name")
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.OrderByDescending(x => x.Name);
                }
                else if (sortOrder == "ascend" && sortField == "name")
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.OrderBy(x => x.Name);
                }

                // SORT STATUS
                if (sortOrder == "descend" && sortField == "status")
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.OrderByDescending(x => x.Status);
                }
                else if (sortOrder == "ascend" && sortField == "status")
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.OrderBy(x => x.Status);
                }

                // FILTERS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.Where(x => status.Contains(x.Status));
                }

                // SEARCH
                if (!string.IsNullOrEmpty(keyword))
                {
                    var normalizeKeyword = keyword.Trim().ToLower();
                    querySprintsDetailsDto = querySprintsDetailsDto.Where(
                        x => x.Name.Contains(keyword) ||
                        x.Name.Trim().ToLower().Contains(normalizeKeyword)
                        );
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = querySprintsDetailsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    querySprintsDetailsDto = querySprintsDetailsDto.Skip(startPage).Take(pageRecords);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listProjectsDetailsDto = querySprintsDetailsDto.ToList();
                var projectsDto = _mapper.Map<SprintsListDto>(listProjectsDetailsDto);
                projectsDto.TotalItem = totalPage;
                projectsDto.NumberPage = numberPage;
                projectsDto.CurrentPage = pageIndex;
                projectsDto.PageSize = pageRecords;
                return projectsDto;
            }
            return null;
        }

        public async Task<ProjectDetailsDto> GetProjectDetailsAsync(string userId)
        {
            var project = await _db.Records
                .Where(x => x.UserId == userId && x.Project.Status == Status.Active)
                .Select(x => new ProjectDetailsDto
                {
                    Id = x.ProjectId,
                    StartedDate = x.Project.StartedDate,
                    EndedDate = x.Project.EndedDate,
                })
                .FirstOrDefaultAsync();

            return project;
        }

        public async Task<SprintCreateDetail> GetCreateSprintDetailsAsync(string projectId)
        {
            var olderSprint = await _db.Sprints
                .Where(x => x.ProjectId == projectId && x.Disable == false)
                .OrderByDescending(x => x.Name)
                .FirstOrDefaultAsync();

            string sprintNamePrefix = "Sprint ";
            var maxSprintName = await _db.Sprints.Where(a => a.Disable == false).OrderByDescending(a => a.Name).FirstOrDefaultAsync();
            int number = maxSprintName != null ? Convert.ToInt32(maxSprintName.Name.Replace(sprintNamePrefix, "")) + 1 : 1;
            string newSprintName = sprintNamePrefix + number.ToString("D2");

            var sprint = new SprintCreateDetail();
            sprint.Name = newSprintName;
            if (olderSprint != null)
            {
                sprint.StartedDate = olderSprint.StartedDate;
                sprint.EndedDate = olderSprint.EndedDate;
            }    

            return sprint;
        }

        public async Task<SprintUpdateDetail> GetUpdateSprintDetailsAsync(string projectId, string sprintId)
        {
            var sprint = await _db.Sprints
                .Where(x => x.Id == sprintId)
                .Select(x => new SprintUpdateDetail
                {
                    Name = x.Name,
                    MaxPoint = x.MaxPoint.ToString(),
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                }).FirstOrDefaultAsync();

            var project = await _db.Sprints
                .Where(x => x.Disable == false && x.ProjectId == projectId)
                .OrderBy(x => x.Name)
                .Select(x => new SprintDetailsDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                })
                .ToListAsync();

            var index = project.FindIndex(x => x.Id == sprintId);
            if (index - 1 >= 0) sprint.OlderSprint = project[index - 1];
            else sprint.OlderSprint = new SprintDetailsDto();
            if ((index + 1) + 1 <= project.Count()) sprint.NewerSprint = project[index + 1];
            else sprint.NewerSprint = new SprintDetailsDto();

            return sprint;
        }

        public async Task<Sprint> CreateSprintAsync(SprintCreateDto model)
        {
            var sprint = _mapper.Map<Sprint>(model);
            sprint.Id = Guid.NewGuid().ToString();
            sprint.MaxPoint = Convert.ToInt32(model.MaxPoint);
            sprint.Status = Status.Active;

            await _db.AddAsync(sprint);
            await _db.SaveChangesAsync();
            return sprint;
        }

        public async Task<Sprint> UpdateSprintAsync(SprintUpdateDto model)
        {
            var sprint = await _db.Sprints.FindAsync(model.Id);

            sprint.StartedDate = model.StartedDate;
            sprint.EndedDate = model.EndedDate;
            sprint.MaxPoint = model.MaxPoint;

            await _db.SaveChangesAsync();
            return sprint;
        }

        public async Task<Sprint> DisableSprintAsync(string sprintId)
        {
            var sprint = await _db.Sprints.FindAsync(sprintId);

            sprint.Disable = true;

            await _db.SaveChangesAsync();
            return sprint;
        }
    }
}
