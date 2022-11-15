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

        public AssignmentService(ApplicationDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }


        public async Task<List<CategoryDetailsDto>> GetCategoriesListAsync(string userId)
        {
            var projectId = await _db.Records
                .Where(x => x.UserId == userId && x.Project.Status == Status.Active)
                .Select(x => x.ProjectId)
                .FirstOrDefaultAsync();
            var categories = await _db.Categories.Where(x => x.ProjectId == projectId).ToListAsync();
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

        public async Task<List<SprintDetailsDto>> GetSprintsListAsync(string userId)
        {
            var projectId = await _db.Records
                .Where(x => x.UserId == userId && x.Project.Status == Status.Active)
                .Select(x => x.ProjectId)
                .FirstOrDefaultAsync();
            var sprints = await _db.Sprints
                .Where(x => x.Disable == false && x.ProjectId == projectId)
                .ToListAsync();
            var sprintsDto = _mapper.Map<List<SprintDetailsDto>>(sprints);
            return sprintsDto;
        }

        public async Task<AssignmentFilterListDto> GetFilterListAsync(string userId)
        {
            var projectId = await _db.Records
                .Where(x => x.UserId == userId && x.Project.Status == Status.Active)
                .Select(x => x.ProjectId)
                .FirstOrDefaultAsync();

            var sprints = await _db.Sprints
                .Where(x => x.Disable == false && x.ProjectId == projectId)
                .Select(x => new SprintFilterDto
                {
                    Label = x.Name,
                    Key = x.Name,
                }).ToListAsync();

            var categories = await _db.Categories
                .Where(x => x.ProjectId == projectId)
                .Select(x => new CategoryFilterDto
                {
                    Label = x.Name,
                    Key = x.Name,
                }).ToListAsync();

            var filters = new AssignmentFilterListDto
            {
                Sprints = sprints,
                Categories = categories,
            };
            return filters;
        }

        public async Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder, string sprintId)
        {
            var productOwnerRoleId = await _db.Roles.Where(r => r.Name == "ProductOwner").Select(x => x.Id).FirstOrDefaultAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId != productOwnerRoleId).Select(u => u.UserId).ToListAsync();

            var sprint = await _db.Sprints.FindAsync(sprintId);

            var test = _db.Assignments.Where(a => a.DeveloperId == "b6632bd0-acc3-4382-83da-de0425a1afdb").Select(a => a.Point).ToList();
            var testSum = test.Sum();
            var moreTest = _db.Assignments.Where(a => a.DeveloperId == "b6632bd0-acc3-4382-83da-de0425a1afdb").Sum(a => a.Point);

            var queryUsersDetailsDto = _db.Records
                .Where(
                    x => x.ProjectId == sprint.ProjectId &&
                    x.Project.Status == Status.Active &&
                    developerList.Contains(x.UserId) &&
                    _db.Assignments.Where(a => a.DeveloperId == x.UserId).Sum(a => a.Point) + _db.Problems.Where(a => a.DeveloperId == x.UserId).Sum(a => a.Point) < sprint.MaxPoint
                ).OrderBy(x => x.User.FirstName + " " + x.User.LastName)
                .Select(x => new UserDetailsDto
                {
                    Id = x.UserId,
                    UserCode = x.User.UserCode,
                    UserName = x.User.UserName,
                    FullName = x.User.FirstName + " " + x.User.LastName,
                    Gender = ((Gender)x.User.Gender).ToString(),
                    DateOfBirth = x.User.DateOfBirth,
                    Disabled = x.User.Disable,
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.UserId).RoleId).Name
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

        public async Task<AssignmentsListDto> GetAssignmentsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string projectId)
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

            IQueryable<Assignment> queryAssignmentsDetailsDto = _db.Assignments
                .Where(
                    x => x.Disable == false &&
                    x.Sprint.ProjectId == projectId)
                .Include(x => x.Sprint)
                .Include(x => x.Category)
                .Include(x => x.Developer)
                .OrderBy(x => x.Name);

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
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderByDescending(x => x.Sprint.Name);
                }
                else if (sortOrder == "ascend" && sortField == "sprintName")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderBy(x => x.Sprint.Name);
                }

                // FILTERS STATUS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    foreach (var state in status)
                    {
                        Status assignmentState;
                        queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => Enum.TryParse(state, out assignmentState) && assignmentState == x.Status);
                    }
                }

                // FILTERS SPRINT
                if ((sprint.Length > 0 && !sprint.Contains("All")))
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => sprint.Contains(x.Sprint.Name));
                }

                // FILTERS CATEGORY
                if ((category.Length > 0 && !category.Contains("All")))
                {
                    foreach (var categoryState in category)
                    {
                        queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => categoryState == x.Category.Name);
                    }
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
                var assignment = _mapper.Map<List<AssignmentDetailsDto>>(queryAssignmentsDetailsDto);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listAssignmentsDetailsDto = queryAssignmentsDetailsDto.ToList();
                var assignmentsDto = _mapper.Map<AssignmentsListDto>(assignment);
                assignmentsDto.TotalItem = totalPage;
                assignmentsDto.NumberPage = numberPage;
                assignmentsDto.CurrentPage = pageIndex;
                assignmentsDto.PageSize = pageRecords;
                return assignmentsDto;
            }
            return null;
        }

        public async Task<AssignmentsListDto> GetAssignedAssignmentsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId)
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

            IQueryable<Assignment> queryAssignmentsDetailsDto = _db.Assignments
                .Where(
                    x => x.Disable == false &&
                    x.Sprint.ProjectId == _db.Records.Where(
                            r => r.UserId == userId &&
                            r.Project.Status == Status.Active
                        ).FirstOrDefault().ProjectId &&
                    x.DeveloperId == userId)
                .Include(x => x.Sprint)
                .Include(x => x.Category)
                .OrderBy(x => x.Name);

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
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderByDescending(x => x.Sprint.Name);
                }
                else if (sortOrder == "ascend" && sortField == "sprintName")
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.OrderBy(x => x.Sprint.Name);
                }

                // FILTERS STATUS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    foreach (var state in status)
                    {
                        Status assignmentState;
                        queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => Enum.TryParse(state, out assignmentState) && assignmentState == x.Status);
                    }
                }

                // FILTERS SPRINT
                if ((sprint.Length > 0 && !sprint.Contains("All")))
                {
                    queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => sprint.Contains(x.Sprint.Name));
                }

                // FILTERS CATEGORY
                if ((category.Length > 0 && !category.Contains("All")))
                {
                    foreach (var categoryState in category)
                    {
                        queryAssignmentsDetailsDto = queryAssignmentsDetailsDto.Where(x => categoryState == x.Category.Name);
                    }
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
                var assignment = _mapper.Map<List<AssignmentDetailsDto>>(queryAssignmentsDetailsDto);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listAssignmentsDetailsDto = queryAssignmentsDetailsDto.ToList();
                var assignmentsDto = _mapper.Map<AssignmentsListDto>(assignment);
                assignmentsDto.TotalItem = totalPage;
                assignmentsDto.NumberPage = numberPage;
                assignmentsDto.CurrentPage = pageIndex;
                assignmentsDto.PageSize = pageRecords;
                return assignmentsDto;
            }
            return null;
        }
        
        public async Task<AssignmentBoardDto> GetBoardAssignmentsListAsync(string userId)
        {
            var todo = await _db.Assignments
                .Where(x => x.DeveloperId == userId && x.Status == Status.Todo)
                .Select(x => new AssignmentDetailsDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Category = x.Category.Name,
                    EndedDate = x.EndedDate,
                })
                .ToListAsync();

            var inProgress = await _db.Assignments
                .Where(x => x.DeveloperId == userId && x.Status == Status.InProgress)
                .Select(x => new AssignmentDetailsDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Category = x.Category.Name,
                    EndedDate = x.EndedDate,
                })
                .ToListAsync();

            var inReview = await _db.Assignments
                .Where(x => x.DeveloperId == userId && x.Status == Status.InReview)
                .Select(x => new AssignmentDetailsDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Category = x.Category.Name,
                    EndedDate = x.EndedDate,
                })
                .ToListAsync();

            var assignment = new AssignmentBoardDto
            {
                Todo = todo,
                InProgress = inProgress,
                InReview = inReview,
            };

            return assignment;
        }

        public async Task<AssignmentDetailsDto> GetAssignmentDetailAsync(string assignmentId)
        {
            var assignment = await _db.Assignments
                .Where(x => x.Disable == false && x.Id == assignmentId)
                .Select(x => new AssignmentDetailsDto
                {
                    Id = x.Id,
                    AssignmentCode = x.AssignmentCode,
                    Name = x.Name,
                    Description = x.Description,
                    Status = ((Status)x.Status).ToString(),
                    Point = x.Point,
                    Category = x.Category.Name,
                    SprintName = x.Sprint.Name,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    Developer = _db.Users
                        .Where(u => u.Id == x.DeveloperId)
                        .Select(u => new UserDetailsDto
                        {
                            Id = u.Id,
                            UserCode = u.UserCode,
                            FullName = u.FirstName + " " + u.LastName,
                            UserName = u.UserName,
                            Role = _db.Roles.FirstOrDefault(z => z.Id == _db.UserRoles.FirstOrDefault(y => y.UserId == u.Id).RoleId).Name
                        }).FirstOrDefault(),
                }).FirstOrDefaultAsync();
            
            return assignment;
        }

        public async Task<AssignmentUpdateDetail> GetAssignmentUpdateDetailAsync(string assignmentId)
        {
            var assignment = await _db.Assignments.FindAsync(assignmentId);
            var sprint = await _db.Sprints.FindAsync(assignment.SprintId);
            var assignmentDto = _mapper.Map<AssignmentUpdateDetail>(assignment);
            assignmentDto.CategoryName = await _db.Categories.Where(x => x.Id == assignmentDto.CategoryId).Select(x => x.Name).FirstOrDefaultAsync();
            assignmentDto.Sprint = _mapper.Map<SprintDetailsDto>(sprint);
            assignmentDto.DeveloperName = await _db.Users.Where(x => x.Id == assignmentDto.DeveloperId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefaultAsync();
            return assignmentDto;
        }

        public async Task<Assignment> CreateAssignmentAsync(AssignmentCreateDto model)
        {
            var assignmentCode = await GenerateAssignmentCode();

            var assignment = new Assignment
            {
                Id = Guid.NewGuid().ToString(),
                AssignmentCode = assignmentCode,
                Name = model.Name,
                Description = model.Description,
                Point = Convert.ToInt32(model.Point),
                Status = Status.Pending,
                CategoryId = model.CategoryId,
                SprintId = model.SprintId,
                StartedDate = model.StartedDate,
                EndedDate = model.EndedDate,
                DeveloperId = model.DeveloperId,
            };

            await _db.AddAsync(assignment);
            await _db.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment> UpdateAssignmentAsync(AssignmentUpdateDto model)
        {
            Enum.TryParse(model.Status, out Status newStatus);
            var assignment = await _db.Assignments.FindAsync(model.Id);
            assignment.Name = model.Name;
            assignment.Description = model.Description;
            assignment.Status = newStatus;
            assignment.Point = Convert.ToInt32(model.Point);
            assignment.CategoryId = model.CategoryId;
            assignment.SprintId = model.SprintId;
            assignment.StartedDate = model.StartedDate;
            assignment.EndedDate = model.EndedDate;
            assignment.DeveloperId = model.DeveloperId;

            await _db.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment> AcceptAssignmentAsync(string assignmentId)
        {
            var assignment = await _db.Assignments.FindAsync(assignmentId);
            assignment.Status = Status.Todo;
            await _db.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment> UpdateAssignmentStatusAsync(string assignmentId, string status)
        {
            var assignment = await _db.Assignments.FindAsync(assignmentId);
            if (status == "To Do") assignment.Status = Status.Todo;
            if (status == "In Progress") assignment.Status = Status.InProgress;
            if (status == "In Review") assignment.Status = Status.InReview;
            await _db.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment> DisableAssignmentAsync(string assignmentId)
        {
            var assignment = await _db.Assignments.FindAsync(assignmentId);
            assignment.Disable = true;
            await _db.SaveChangesAsync();
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
