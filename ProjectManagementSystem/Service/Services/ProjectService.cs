using ProjectManagementSystem.Service.IServices;
using ProjectManagementSystem.Models.Project;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Data;
using System.Threading.Tasks;
using System.Linq;
using System;
using AutoMapper;

namespace ProjectManagementSystem.Service.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        public ProjectService (ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        public async Task<ProjectsListDto> GetProjectsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder)
        {
            if (status.Length == 0)
            {
                status = new string[] { "All" };
            }
            
            var queryProjectsDetailsDto = _db.Projects
                .Where(
                    x => x.Disable == false
                ).OrderBy(x => x.Name)
                .Select(x => new ProjectDetailsDto
                {
                    Id = x.Id,
                    ProjectCode = x.ProjectCode,
                    Name = x.Name,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Status = ((Status)x.Status).ToString(),
                    Iterations = x.Iterations,
                    AdvisorId = x.AdvisorId,
                    Disable = x.Disable,
                });

            if (queryProjectsDetailsDto != null)
            {
                // SORT PROJECT CODE
                if (sortOrder == "descend" && sortField == "projectCode")
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.OrderByDescending(x => x.ProjectCode);
                }
                else if (sortOrder == "ascend" && sortField == "projectCode")
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.OrderBy(x => x.ProjectCode);
                }

                // SORT NAME
                if (sortOrder == "descend" && sortField == "name")
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.OrderByDescending(x => x.Name);
                }
                else if (sortOrder == "ascend" && sortField == "name")
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.OrderBy(x => x.Name);
                }

                // SORT STATUS
                if (sortOrder == "descend" && sortField == "status")
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.OrderByDescending(x => x.Status);
                }
                else if (sortOrder == "ascend" && sortField == "status")
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.OrderBy(x => x.Status);
                }

                // FILTERS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.Where(x => status.Contains(x.Status));
                }

                // SEARCH
                if (!string.IsNullOrEmpty(keyword))
                {
                    var normalizeKeyword = keyword.Trim().ToLower();
                    queryProjectsDetailsDto = queryProjectsDetailsDto.Where(
                        x => x.ProjectCode.Contains(keyword) ||
                        x.ProjectCode.Trim().ToLower().Contains(normalizeKeyword) ||
                        x.Name.Contains(keyword) ||
                        x.Name.Trim().ToLower().Contains(normalizeKeyword)
                        );
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = queryProjectsDetailsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    queryProjectsDetailsDto = queryProjectsDetailsDto.Skip(startPage).Take(pageRecords);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listProjectsDetailsDto = queryProjectsDetailsDto.ToList();
                var projectsDto = _mapper.Map<ProjectsListDto>(listProjectsDetailsDto);
                projectsDto.TotalItem = totalPage;
                projectsDto.NumberPage = numberPage;
                projectsDto.CurrentPage = pageIndex;
                projectsDto.PageSize = pageRecords;
                return projectsDto;
            }
            return null;
        }
    }
}