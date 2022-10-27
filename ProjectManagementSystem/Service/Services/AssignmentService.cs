using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.User;
using ProjectManagementSystem.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Service.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public AssignmentService (ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }


        public async Task<List<CategoryDetailsDto>> GetCategoriesListAsync()
        {
            var categories = await _db.Categories.ToListAsync();
            var categoriesList = _mapper.Map<List<CategoryDetailsDto>>(categories);
            return categoriesList;
        }

        public async Task<Category> CreateCategoryAsync(CategoryCreateDto model)
        {
            var category = new Category
            {
                Id = Guid.NewGuid().ToString(),
                Name = model.Name,
            };

            await _db.Categories.AddAsync(category);
            await _db.SaveChangesAsync();
            return category;
        }

        public async Task<List<SprintDetailsDto>> GetSprintsListAsync()
        {
            var sprints = await _db.Sprints
                .Where(x => x.Disable == false)
                .ToListAsync();
            var sprintsDto = _mapper.Map<List<SprintDetailsDto>>(sprints);
            return sprintsDto;
        }

        public async Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var scrumMasterRoleId = await _db.Roles.Where(r => r.Name == "ScrumMaster").Select(x => x.Id).FirstOrDefaultAsync();
            var developerRoleId = await _db.Roles.Where(r => r.Name == "Developer").Select(x => x.Id).FirstOrDefaultAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId == scrumMasterRoleId || u.RoleId == developerRoleId).Select(u => u.UserId).ToListAsync();
            var test = await _db.Users.Where(x => developerList.Contains(x.Id)).ToListAsync();

            var queryUsersDetailsDto = _db.Users
                .Where(
                    x => x.Disable == false && 
                    developerList.Contains(x.Id)
                ).OrderBy(x => x.FirstName + " " + x.LastName)
                .Select(x => new UserDetailsDto
                {
                    Id = x.Id,
                    UserCode = x.UserCode,
                    UserName = x.UserName,
                    FullName = x.FirstName + " " + x.LastName,
                    Gender = ((Gender)x.Gender).ToString(),
                    DateOfBirth = x.DateOfBirth,
                    Disabled = x.Disable,
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.Id).RoleId).Name
                });
            if (queryUsersDetailsDto != null)
            {
                // SORT USER CODE
                if (sortOrder == "descend" && sortField == "userCode")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderByDescending(x => x.UserCode);
                }
                else if (sortOrder == "ascend" && sortField == "userCode")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderBy(x => x.UserCode);
                }

                // SORT FULL NAME
                if (sortOrder == "descend" && sortField == "fullName")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderByDescending(x => x.FullName);
                }
                else if (sortOrder == "ascend" && sortField == "fullName")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderBy(x => x.FullName);
                }

                // SORT USER NAME
                if (sortOrder == "descend" && sortField == "userName")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderByDescending(x => x.UserName);
                }
                else if (sortOrder == "ascend" && sortField == "userName")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderBy(x => x.UserName);
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = queryUsersDetailsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    queryUsersDetailsDto = queryUsersDetailsDto.Skip(startPage).Take(pageRecords);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listUsersDetailsDto = queryUsersDetailsDto.ToList();
                var usersDto = _mapper.Map<UsersListDto>(listUsersDetailsDto);
                usersDto.TotalItem = totalPage;
                usersDto.NumberPage = numberPage;
                usersDto.CurrentPage = pageIndex;
                usersDto.PageSize = pageRecords;
                return usersDto;
            }
            return null;
        }

        public async Task<AssignmentsListDto> GetAssignmentsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId)
        {
            if (status.Length == 0)
            {
                status = new string[] { "All" };
            }

            if (sprint.Length == 0)
            {
                sprint = new string[] { "All" };
            }

            if (category.Length == 0)
            {
                category = new string[] { "All" };
            }

            var queryAssignmentsDetailsDto = _db.Assignments
                .Where(
                    x => x.Disable == false && x.ProjectId == _db.Records.Where(r => r.UserId == userId && r.Project.Status == Status.Active).FirstOrDefault().ProjectId
                ).OrderBy(x => x.Name)
                .Select(x => new AssignmentDetailsDto
                {
                    Id = x.Id,
                    AssignmentCode = x.AssignmentCode,
                    Name = x.Name,
                    Description = x.Description,
                    Category = x.Category.Name,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Point = x.Point,
                    Status = ((Status)x.Status).ToString(),
                    ProjectId = x.ProjectId,
                    SprintId = x.SprintId,
                    SprintName = x.Sprint.Name,
                    DeveloperId = x.DeveloperId,
                });

            if (queryAssignmentsDetailsDto != null)
            {
                // SORT ASSIGNMENT CODE
                if (sortOrder == "descend" && sortField == "assignmentCode")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderByDescending(x => x.AssignmentCode);
                }
                else if (sortOrder == "ascend" && sortField == "assignmentCode")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderBy(x => x.AssignmentCode);
                }

                // SORT NAME
                if (sortOrder == "descend" && sortField == "name")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderByDescending(x => x.Name);
                }
                else if (sortOrder == "ascend" && sortField == "name")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderBy(x => x.Name);
                }

                // SORT STATUS
                if (sortOrder == "descend" && sortField == "status")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderByDescending(x => x.Status);
                }
                else if (sortOrder == "ascend" && sortField == "status")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderBy(x => x.Status);
                }

                // SORT SPRINT
                if (sortOrder == "descend" && sortField == "sprintName")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderByDescending(x => x.SprintName);
                }
                else if (sortOrder == "ascend" && sortField == "sprintName")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderBy(x => x.SprintName);
                }

                // FILTERS STATUS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => status.Contains(x.Status));
                }

                // FILTERS SPRINT
                if ((sprint.Length > 0 && !sprint.Contains("All")))
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => sprint.Contains(x.SprintName));
                }

                // FILTERS CATEGORY
                if ((category.Length > 0 && !category.Contains("All")))
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => category.Contains(x.Category));
                }

                // SEARCH
                if (!string.IsNullOrEmpty(keyword))
                {
                    var normalizeKeyword = keyword.Trim().ToLower();
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(
                        x => x.Name.Contains(keyword) ||
                        x.Name.Trim().ToLower().Contains(normalizeKeyword)
                        );
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = queryAssignmentsDetailsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Skip(startPage).Take(pageRecords);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listAssignmentsDetailsDto = queryAssignmentsDetailsDto.ToList();
                var assignmentsDto = _mapper.Map<AssignmentsListDto>(listAssignmentsDetailsDto);
                assignmentsDto.TotalItem = totalPage;
                assignmentsDto.NumberPage = numberPage;
                assignmentsDto.CurrentPage = pageIndex;
                assignmentsDto.PageSize = pageRecords;
                return assignmentsDto;
            }
            return null;
        }

        public async Task<Assignment> CreateAssignmentAsync(AssignmentCreateDto model)
        {
            var category = await _db.Categories.FindAsync(model.CategoryId);

            var projectId = await _db.Sprints.Where(x => x.Id == model.SprintId).Select(x => x.ProjectId).FirstOrDefaultAsync();

            var assignmentCode = await GenerateAssignmentCode();

            var assignment = new Assignment
            {
                Id = Guid.NewGuid().ToString(),
                AssignmentCode = assignmentCode,
                Name = model.Name,
                Description = model.Description,
                Point = Convert.ToInt32(model.Point),
                Status = Status.Active,
                Category = category,
                SprintId = model.SprintId,
                StartedDate = model.StartedDate,
                EndedDate = model.EndedDate,
                DeveloperId = model.DeveloperId,
                ProjectId = projectId,
            };

            var assignmentCreated = await _db.AddAsync(assignment);
            var assignmentCreatedSaved = await _db.SaveChangesAsync();
            return assignment;
        }

        private async Task<string> GenerateAssignmentCode()
        {
            string assignmentCodePrefix = "AC";
            var maxAssignmentCode = await _db.Assignments.Where(a => a.Disable == false).OrderByDescending(a => a.AssignmentCode).FirstOrDefaultAsync();
            int number = maxAssignmentCode != null ? Convert.ToInt32(maxAssignmentCode.AssignmentCode.Replace(assignmentCodePrefix, "")) + 1 : 1;
            string newAssignmentCode = assignmentCodePrefix + number.ToString("D2");
            return newAssignmentCode;
        }
    }
}
