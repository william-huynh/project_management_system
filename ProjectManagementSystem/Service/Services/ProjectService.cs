using ProjectManagementSystem.Service.IServices;
using ProjectManagementSystem.Models.Project;
using ProjectManagementSystem.Models.User;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Data;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using System;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ProjectManagementSystem.Service.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IRecordService _recordService;
        public ProjectService (ApplicationDbContext db, IMapper mapper, IHttpContextAccessor httpContext, IRecordService recordService)
        {
            _db = db;
            _mapper = mapper;
            _httpContext = httpContext;
            _recordService = recordService;
        }

        public async Task<ProjectsListDto> GetProjectsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder)
        {
            if (status.Length == 0)
            {
                status = new string[] { "All" };
            }

            var scrumMasterList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "ScrumMaster").Id).Select(u => u.UserId).ToListAsync();

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
                    AdvisorName = x.Advisor.FirstName + " " + x.Advisor.LastName,
                    Disable = x.Disable,
                    ScrumMaster = _db.Records
                        .Where(r => r.ProjectId == x.Id && scrumMasterList.Contains(r.UserId))
                        .Select(r => new UserDetailsDto
                        {
                            Id = r.UserId,
                        }).FirstOrDefault(),
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

        public async Task<ProjectDetailsDto> GetProjectDetailsAsync(string projectId)
        {
            var scrumMasterList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "ScrumMaster").Id).Select(u => u.UserId).ToListAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "Developer").Id).Select(u => u.UserId).ToListAsync();

            var queryDeveloperDetailDto = await _db.Records
                .Where(x => x.ProjectId == projectId && developerList.Contains(x.UserId))
                .OrderByDescending(x => _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.User.Id).RoleId).Name)
                .Select(x => new UserDetailsDto
                {
                    Id = x.UserId,
                    UserCode = x.User.UserCode,
                    FullName = x.User.FirstName + " " + x.User.LastName,
                    UserName = x.User.UserName,
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.User.Id).RoleId).Name
                }).ToListAsync();

            var projectDetailDto = await _db.Projects
                .Where(x => x.Id == projectId)
                .Select(x => new ProjectDetailsDto
                {
                    Id = x.Id,
                    ProjectCode = x.ProjectCode,
                    Name = x.Name,
                    Description = x.Description,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Status = ((Status)x.Status).ToString(),
                    Advisor = _db.Users
                        .Where(u => u.Id == x.AdvisorId)
                        .Select(u => new UserDetailsDto
                        {
                            Id = u.Id,
                            UserCode = u.UserCode,
                            FullName = u.FirstName + " " + u.LastName,
                            UserName = u.UserName,
                            Role = _db.Roles.FirstOrDefault(z => z.Id == _db.UserRoles.FirstOrDefault(y => y.UserId == u.Id).RoleId).Name
                        }).FirstOrDefault(),
                    ScrumMaster = _db.Records
                        .Where(r => r.ProjectId == x.Id && scrumMasterList.Contains(r.UserId))
                        .Select(r => new UserDetailsDto
                        {
                            Id = r.UserId,
                            UserCode = r.User.UserCode,
                            FullName = r.User.FirstName + " " + r.User.LastName,
                            UserName = r.User.UserName,
                            Role = _db.Roles.FirstOrDefault(z => z.Id == _db.UserRoles.FirstOrDefault(y => y.UserId == r.UserId).RoleId).Name
                        }).FirstOrDefault(),
                }).FirstOrDefaultAsync();

            projectDetailDto.Developers = queryDeveloperDetailDto;
            return projectDetailDto;
        }

        public async Task<Project> CreateProjectAsync(ProjectCreateDto model)
        {
            var projectCode = GenerateProjectCode();
            var currentUser = _httpContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = new Project
            {
                Id = Guid.NewGuid().ToString(),
                ProjectCode = projectCode,
                Name = model.Name,
                Description = model.Description,
                StartedDate = model.StartedDate,
                EndedDate = model.EndedDate,
                Status = Status.Active,
                AdvisorId = currentUser,
            };

            await _db.AddAsync(project);
            await _db.SaveChangesAsync();

            if (model.ScrumMasterId != "")
            {
                var createdScrumMaster = await _recordService.CreateRecordAsync(model.ScrumMasterId, project.Id);
            }
            if (model.Developer1Id != "")
            {
                var createdDeveloper1 = await _recordService.CreateRecordAsync(model.Developer1Id, project.Id);
            }
            if (model.Developer2Id != "")
            {
                var createdDeveloper2 = await _recordService.CreateRecordAsync(model.Developer2Id, project.Id);
            }
            if (model.Developer3Id != "")
            {
                var createdDeveloper3 = await _recordService.CreateRecordAsync(model.Developer3Id, project.Id);
            }
            if (model.Developer4Id != "")
            {
                var createdDeveloper4 = await _recordService.CreateRecordAsync(model.Developer4Id, project.Id);
            }
            return project;
        }

        public async Task<ProjectUpdateDetail> GetProjectUpdateDetailAsync(string projectId)
        {
            var scrumMasterList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "ScrumMaster").Id).Select(u => u.UserId).ToListAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "Developer").Id).Select(u => u.UserId).ToListAsync();

            var project = await _db.Projects.FindAsync(projectId);
            var scrumMaster = await _db.Records.Where(
                    x => x.ProjectId == project.Id && scrumMasterList.Contains(x.UserId)
                ).Select(x => new ProjectUpdateUsers
                {
                    Id = x.UserId,
                    FullName = x.User.FirstName + " " + x.User.LastName,
                }).FirstOrDefaultAsync();
            var developers = await _db.Records.Where(
                    x => x.ProjectId == project.Id && developerList.Contains(x.UserId)
                ).Select(x => new ProjectUpdateUsers
                {
                    Id = x.UserId,
                    FullName = x.User.FirstName + " " + x.User.LastName,
                }).ToListAsync();

            var projectDetail = new ProjectUpdateDetail
            {
                Name = project.Name,
                Description = project.Description,
                StartedDate = project.StartedDate,
                EndedDate = project.EndedDate,
            };

            if (scrumMaster == null || developers.Count == 0)
            {
                if (scrumMaster == null && developers.Count == 0)
                {
                    projectDetail.ScrumMasterId = "";
                    projectDetail.ScrumMasterName = "";
                    projectDetail.Developers = new List<ProjectUpdateUsers>();
                }
                if (scrumMaster == null)
                {
                    projectDetail.ScrumMasterId = "";
                    projectDetail.ScrumMasterName = "";
                    projectDetail.Developers = developers;
                }
                if (developers.Count == 0)
                {
                    projectDetail.ScrumMasterId = scrumMaster.Id;
                    projectDetail.ScrumMasterName = scrumMaster.FullName;
                    projectDetail.Developers = new List<ProjectUpdateUsers>();
                }
            } else
            {
                projectDetail.ScrumMasterId = scrumMaster.Id;
                projectDetail.ScrumMasterName = scrumMaster.FullName;
                projectDetail.Developers = developers;
            }
            
            return projectDetail;
        }

        public async Task<Project> UpdateProjectAsync(ProjectUpdateDto model)
        {
            var scrumMasterList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "ScrumMaster").Id).Select(u => u.UserId).ToListAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "Developer").Id).Select(u => u.UserId).ToListAsync();
            
            var project = await _db.Projects.FindAsync(model.Id);
            var scrumMaster = await _db.Records.Where(x => x.ProjectId == model.Id && scrumMasterList.Contains(x.UserId)).FirstOrDefaultAsync();
            var developers = await _db.Records.Where(x => x.ProjectId == model.Id && developerList.Contains(x.UserId)).Select(x => x.UserId).ToListAsync();

            project.Name = model.Name;
            project.Description = model.Description;
            project.StartedDate = model.StartedDate;
            project.EndedDate = model.EndedDate;

            // Update assign scrum master
            if (scrumMaster != null)
            {
                if (model.ScrumMasterId != "")
                {
                    if (scrumMaster.UserId != model.ScrumMasterId)
                    {
                        await _recordService.RemoveRecordAsync(scrumMaster.Id);
                        await _recordService.CreateRecordAsync(model.ScrumMasterId, model.Id);
                    } 
                }
                else 
                {
                    await _recordService.RemoveRecordAsync(scrumMaster.Id);
                }
            }
            else 
            {
                if (model.ScrumMasterId != "")
                {
                    await _recordService.CreateRecordAsync(model.ScrumMasterId, model.Id);
                }
            }

            // Update assign developers
            if (developers.Count != 0)
            {
                if (model.Developer1Id != "" || model.Developer2Id != "" || model.Developer3Id != "" || model.Developer4Id != "")
                {
                    // Add new developers
                    if (!developers.Contains(model.Developer1Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer1Id, model.Id);
                    }
                    if (!developers.Contains(model.Developer2Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer2Id, model.Id);
                    }
                    if (!developers.Contains(model.Developer3Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer3Id, model.Id);
                    }
                    if (!developers.Contains(model.Developer4Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer4Id, model.Id);
                    }

                    // Remove old developers
                    for (int index = 0; index < developers.Count; index++)
                    {
                        if (developers[index] != model.Developer1Id)
                        {
                            if (developers[index] != model.Developer2Id)
                            {
                                if (developers[index] != model.Developer3Id)
                                {
                                    if (developers[index] != model.Developer4Id)
                                    {
                                        await _recordService.RemoveRecordAsync(developers[index]);
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    for (int index = 0; index < developers.Count; index++)
                    {
                        await _recordService.RemoveRecordAsync(developers[index]);
                    }
                }
            }
            else
            {
                if (model.Developer1Id != "")
                {
                    await _recordService.CreateRecordAsync(model.Developer1Id, model.Id);
                }
                if (model.Developer2Id != "")
                {
                    await _recordService.CreateRecordAsync(model.Developer2Id, model.Id);
                }
                if (model.Developer3Id != "")
                {
                    await _recordService.CreateRecordAsync(model.Developer3Id, model.Id);
                }
                if (model.Developer4Id != "")
                {
                    await _recordService.CreateRecordAsync(model.Developer4Id, model.Id);
                }
            }

            await _db.SaveChangesAsync();
            return project;
        }
        
        public async Task<Project> DisableProjectAsync(string projectId)
        {
            var project = await _db.Projects.FindAsync(projectId);
            project.Disable = true;
            await _db.SaveChangesAsync();
            return project;
        }

        private string GenerateProjectCode()
        {
            string staffPrefix = "PC";
            var maxProjectCode = _db.Projects.OrderByDescending(a => a.ProjectCode).FirstOrDefault();
            int number = maxProjectCode != null ? Convert.ToInt32(maxProjectCode.ProjectCode.Replace(staffPrefix, "")) + 1 : 1;
            string newProjectCode = staffPrefix + number.ToString("D4");
            return newProjectCode;
        }
        }
}