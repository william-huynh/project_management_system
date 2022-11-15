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
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.Misc;

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

        public async Task<ProjectsListDto> GetProjectsListAsync(int? page, int? pageSize, string[] status, string advisorId)
        {
            if (status.Length == 0)
            {
                status = new string[] { "All" };
            }

            IQueryable<Project> queryProjectsDetailsDto = _db.Projects
                .Where(x => x.Disable == false)
                .Include(x => x.Advisor)
                .OrderByDescending(x => x.ProjectCode);


            if (queryProjectsDetailsDto != null)
            {
                // GET MANAGE
                if (advisorId != null)
                {
                    queryProjectsDetailsDto = queryProjectsDetailsDto.Where(x => x.AdvisorId == advisorId);
                }
                
                // FILTERS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    foreach(var state in status)
                    {
                        Status projectState;
                        queryProjectsDetailsDto = queryProjectsDetailsDto.Where(x => Enum.TryParse(state, out projectState) && projectState == x.Status);
                    }
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = queryProjectsDetailsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    queryProjectsDetailsDto = queryProjectsDetailsDto.Skip(startPage).Take(pageRecords);
                var project = _mapper.Map<List<ProjectDetailsDto>>(queryProjectsDetailsDto);

                for (int i = 0; i < project.Count(); i++)
                {
                    project[i].TotalSprintsNumber = await _db.Sprints.Where(x => x.Disable == false && x.ProjectId == project[i].Id).CountAsync();
                    project[i].TotalAssignmentsNumber = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == project[i].Id).CountAsync();
                    project[i].TotalProblemsNumber = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == project[i].Id).CountAsync();
                    var completeAssignment = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == project[i].Id && x.Status == Status.Complete).CountAsync();
                    var completeProblem = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == project[i].Id && x.Status == Status.Complete).CountAsync();
                    project[i].TotalCompleteNumber = completeAssignment + completeProblem ;
                    project[i].AssignedDevelopers = await _db.Records
                        .Where(x => x.ProjectId == project[i].Id)
                        .Select(x => new UserDetailsDto
                        {
                            Id = x.UserId,
                            Image = _db.Images
                                .Where(i => i.AssociatedId == x.UserId)
                                .Select(i => new ImageDto {
                                    Id = i.Id,
                                    ImageName = i.ImageName,
                                }).FirstOrDefault(),
                        }).ToListAsync();
                }

                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listProjectsDetailsDto = queryProjectsDetailsDto.ToList();
                var projectsDto = _mapper.Map<ProjectsListDto>(project);
                projectsDto.TotalItem = totalPage;
                projectsDto.NumberPage = numberPage;
                projectsDto.CurrentPage = pageIndex;
                projectsDto.PageSize = pageRecords;
                return projectsDto;
            }
            return null;
        }

        public async Task<ProjectsListDto> GetManageProjectsListAsync(int? page, int? pageSize, string keyword, string[] status, string sortField, string sortOrder, string advisorId)
        {
            if (status.Length == 0)
            {
                status = new string[] { "All" };
            }

            IQueryable<Project> queryProjectsDetailsDto = _db.Projects
                .Where(x => x.Disable == false && x.AdvisorId == advisorId)
                .Include(x => x.Advisor)
                .OrderBy(x => x.Name);

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
                    foreach (var state in status)
                    {
                        Status projectState;
                        queryProjectsDetailsDto = queryProjectsDetailsDto.Where(x => Enum.TryParse(state, out projectState) && projectState == x.Status);
                    }
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
                var project = _mapper.Map<List<ProjectDetailsDto>>(queryProjectsDetailsDto);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listProjectsDetailsDto = queryProjectsDetailsDto.ToList();
                var projectsDto = _mapper.Map<ProjectsListDto>(project);
                projectsDto.TotalItem = totalPage;
                projectsDto.NumberPage = numberPage;
                projectsDto.CurrentPage = pageIndex;
                projectsDto.PageSize = pageRecords;
                return projectsDto;
            }
            return null;
        }

        public async Task<ProjectDetailsDto> GetProjectDashboardDetailsAsync(string projectId) 
        {
            var project = await _db.Projects.FindAsync(projectId);
            var advisor = await _db.Users.FindAsync(project.AdvisorId);
            var developer = await _db.Records.Where(x => x.ProjectId == projectId).CountAsync();
            var disable = true;
            var sprints = await _db.Sprints.Where(x => x.Disable == false && x.ProjectId == projectId).ToListAsync();
            var assignment = new AssignmentSummaryDto 
            {
                ProductBacklog = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.ProductBacklog).CountAsync(),
                Backlog = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Backlog).CountAsync(),
                Pending = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Pending).CountAsync(),
                Todo = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Todo).CountAsync(),
                InProgress = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.InProgress).CountAsync(),
                InReview = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.InReview).CountAsync(),
                Complete = await _db.Assignments.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Complete).CountAsync(),
            };
            var problem = new AssignmentSummaryDto 
            {
                ProductBacklog = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.ProductBacklog).CountAsync(),
                Backlog = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Backlog).CountAsync(),
                Pending = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Pending).CountAsync(),
                Todo = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Todo).CountAsync(),
                InProgress = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.InProgress).CountAsync(),
                InReview = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.InReview).CountAsync(),
                Complete = await _db.Problems.Where(x => x.Disable == false && x.Sprint.ProjectId == projectId && x.Status == Status.Complete).CountAsync(),
            };

            var advisorDto = _mapper.Map<UserDetailsDto>(advisor);
            var sprintDto = _mapper.Map<List<SprintDetailsDto>>(sprints);
            foreach (var sprint in sprintDto)
            {
                sprint.AssignmentsNumber = await _db.Assignments.Where(x => x.SprintId == sprint.Id && x.Disable == false).CountAsync();
                sprint.AssignmentsCompleteNumber = await _db.Assignments.Where(x => x.SprintId == sprint.Id && x.Disable == false && x.Status == Status.Complete).CountAsync();
                sprint.ProblemsNumber = await _db.Problems.Where(x => x.SprintId == sprint.Id && x.Disable == false).CountAsync();
                sprint.ProblemsCompleteNumber = await _db.Problems.Where(x => x.SprintId == sprint.Id && x.Disable == false && x.Status == Status.Complete).CountAsync();
            }

            if (developer != 0) disable = false;

            var projectDashboardDto = new ProjectDetailsDto
            {
                Id = project.Id,
                ProjectCode = project.ProjectCode,
                Name = project.Name,
                Status = ((Status)project.Status).ToString(),
                StartedDate = project.StartedDate,
                EndedDate = project.EndedDate,
                Advisor = advisorDto,
                Sprints = sprintDto,
                Assignment = assignment,
                Problem = problem,
                Disable = disable,
            };
            return projectDashboardDto;
        }

        public async Task<ProjectSummaryDto> GetProjectSummaryAsync(string advisorId)
        {
            var total = await _db.Projects.Where(x => x.Disable == false).CountAsync();

            IQueryable<Project> queryActive = _db.Projects.Where(x => x.Disable == false && x.Status == Status.Active);
            IQueryable<Project> queryComplete = _db.Projects.Where(x => x.Disable == false && x.Status == Status.Complete);
            IQueryable<Project> queryOwned = _db.Projects.Where(x => x.Disable == false);

            if (advisorId != "null")
            {
                queryActive = queryActive.Where(x => x.AdvisorId == advisorId);
                queryComplete = queryComplete.Where(x => x.AdvisorId == advisorId);
                queryOwned = queryOwned.Where(x => x.AdvisorId == advisorId);
            };

            var active = queryActive.Count();
            var complete = queryComplete.Count();
            var owned = queryOwned.Count();

            var summary = new ProjectSummaryDto
            {
                Total = total,
                Active = active,
                Complete = complete,
                Owned = owned,
            };
            return summary;
        }

        public async Task<Project> CreateProjectAsync(ProjectWriteDto model)
        {
            model.Id = Guid.NewGuid().ToString();
            var projectCode = GenerateProjectCode();
            var currentUser = _httpContext.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var project = new Project
            {
                Id = model.Id,
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

        public async Task<ProjectDetailsDto> GetProjectUpdateDetailAsync(string projectId)
        {
            var scrumMasterList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "ScrumMaster").Id).Select(u => u.UserId).ToListAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "Developer").Id).Select(u => u.UserId).ToListAsync();

            var project = await _db.Projects.FindAsync(projectId);
            var scrumMaster = await _db.Records.Where(
                    x => x.ProjectId == project.Id && scrumMasterList.Contains(x.UserId)
                ).Select(x => new UserDetailsDto
                {
                    Id = x.UserId,
                    FullName = x.User.FirstName + " " + x.User.LastName,
                }).FirstOrDefaultAsync();
            var developers = await _db.Records.Where(
                    x => x.ProjectId == project.Id && developerList.Contains(x.UserId)
                ).Select(x => new UserDetailsDto
                {
                    Id = x.UserId,
                    FullName = x.User.FirstName + " " + x.User.LastName,
                }).ToListAsync();

            var projectDetail = new ProjectDetailsDto
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
                    projectDetail.Developers = new List<UserDetailsDto>();
                } else
                {
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
                        projectDetail.Developers = new List<UserDetailsDto>();
                    }
                }
            } else
            {
                projectDetail.ScrumMasterId = scrumMaster.Id;
                projectDetail.ScrumMasterName = scrumMaster.FullName;
                projectDetail.Developers = developers;
            }
            
            return projectDetail;
        }

        public async Task<Project> UpdateProjectAsync(ProjectWriteDto model)
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
                    if (model.Developer1Id != "" && !developers.Contains(model.Developer1Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer1Id, model.Id);
                    }
                    if (model.Developer2Id != "" && !developers.Contains(model.Developer2Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer2Id, model.Id);
                    }
                    if (model.Developer3Id != "" && !developers.Contains(model.Developer3Id))
                    {
                        await _recordService.CreateRecordAsync(model.Developer3Id, model.Id);
                    }
                    if (model.Developer4Id != "" && !developers.Contains(model.Developer4Id))
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