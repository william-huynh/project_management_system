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
                    SprintCode = x.SprintCode,
                    Name = x.Name,
                    Description = x.Description,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Status = ((Status)x.Status).ToString(),
                });

            if (querySprintsDetailsDto != null)
            {
                // SORT SPRINT CODE
                if (sortOrder == "descend" && sortField == "sprintCode")
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.OrderByDescending(x => x.SprintCode);
                }
                else if (sortOrder == "ascend" && sortField == "sprintCode")
                {
                    querySprintsDetailsDto = querySprintsDetailsDto.OrderBy(x => x.SprintCode);
                }

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
                        x => x.SprintCode.Contains(keyword) ||
                        x.SprintCode.Trim().ToLower().Contains(normalizeKeyword) ||
                        x.Name.Contains(keyword) ||
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

        public async Task<SprintDetailsDto> GetUpdateSprintDetailsAsync(string sprintId)
        {
            var sprint = await _db.Sprints
                .Where(x => x.Id == sprintId)
                .Select(x => new SprintDetailsDto
                {
                    SprintCode = x.SprintCode,
                    Name = x.Name,
                    Description = x.Description,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Status = ((Status)x.Status).ToString(),
                }).FirstOrDefaultAsync();

            return sprint;
        }

        public async Task<SprintCreateDetail> GetProjectSprintDetail(string userId)
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

            var olderSprint = await _db.Sprints
                .Where(x => x.ProjectId == project.Id && x.Disable == false)
                .OrderByDescending(x => x.SprintCode)
                .FirstOrDefaultAsync();

            var sprint = new SprintCreateDetail();
            sprint.Project = project;
            if (olderSprint != null)
            {
                sprint.Name = olderSprint.Name;
                sprint.Description = olderSprint.Description;
                sprint.StartedDate = olderSprint.StartedDate;
                sprint.EndedDate = olderSprint.EndedDate;
            }    

            sprint.Project = project;
            return sprint;
        }

        public async Task<Sprint> CreateSprintAsync(SprintCreateDto model)
        {
            var sprintCode = GenerateSprintCode();

            var sprint = _mapper.Map<Sprint>(model);
            sprint.Id = Guid.NewGuid().ToString();
            sprint.Status = Status.Active;
            sprint.SprintCode = sprintCode;

            await _db.AddAsync(sprint);
            await _db.SaveChangesAsync();
            return sprint;
        }

        public async Task<Sprint> UpdateSprintAsync(SprintUpdateDto model)
        {
            var sprint = await _db.Sprints.FindAsync(model.Id);

            sprint.Name = model.Name;
            sprint.Description = model.Description;
            sprint.StartedDate = model.StartedDate;
            sprint.EndedDate = model.EndedDate;

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

        private string GenerateSprintCode()
        {
            string sprintPrefix = "SC";
            var maxSprintCode = _db.Sprints.OrderByDescending(a => a.SprintCode).FirstOrDefault();
            int number = maxSprintCode != null ? Convert.ToInt32(maxSprintCode.SprintCode.Replace(sprintPrefix, "")) + 1 : 1;
            string newSprintCode = sprintPrefix + number.ToString("D4");
            return newSprintCode;
        }
    }
}
