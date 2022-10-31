using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Problem;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.User;
using ProjectManagementSystem.Service.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProjectManagementSystem.Models.Assignment;

namespace ProjectManagementSystem.Service.Services
{
    public class ProblemService : IProblemService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public ProblemService(ApplicationDbContext db, IMapper mapper)
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

        public async Task<AssignmentsListDto> GetAvailableAssignmentsListAsync(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var queryAssignmentsDto = _db.Assignments
                .Where(x => x.Status == Status.Active && x.Disable == false)
                .OrderBy(x => x.Name)
                .Select(x => new AssignmentDetailsDto
                {
                    Id = x.Id,
                    AssignmentCode = x.AssignmentCode,
                    Name = x.Name,
                });

            if(queryAssignmentsDto != null)
            {
                // SORT ASSIGNMENT CODE
                if (sortOrder == "descend" && sortField == "assignmentCode")
                {
                    queryAssignmentsDto = queryAssignmentsDto.OrderByDescending(x => x.AssignmentCode);
                }
                else if (sortOrder == "ascend" && sortField == "assignmentCode")
                {
                    queryAssignmentsDto = queryAssignmentsDto.OrderBy(x => x.AssignmentCode);
                }

                // SORT NAME
                if (sortOrder == "descend" && sortField == "name")
                {
                    queryAssignmentsDto = queryAssignmentsDto.OrderByDescending(x => x.Name);
                }
                else if (sortOrder == "ascend" && sortField == "name")
                {
                    queryAssignmentsDto = queryAssignmentsDto.OrderBy(x => x.Name);
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = queryAssignmentsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    queryAssignmentsDto = queryAssignmentsDto.Skip(startPage).Take(pageRecords);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listAssignmentsDetailsDto = queryAssignmentsDto.ToList();
                var assignmentsDto = _mapper.Map<AssignmentsListDto>(listAssignmentsDetailsDto);
                assignmentsDto.TotalItem = totalPage;
                assignmentsDto.NumberPage = numberPage;
                assignmentsDto.CurrentPage = pageIndex;
                assignmentsDto.PageSize = pageRecords;
                return assignmentsDto;
            }
            return null;
        }

        public async Task<UsersListDto> GetAvailableDeveloperListAsync(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var scrumMasterRoleId = await _db.Roles.Where(r => r.Name == "ScrumMaster").Select(x => x.Id).FirstOrDefaultAsync();
            var developerRoleId = await _db.Roles.Where(r => r.Name == "Developer").Select(x => x.Id).FirstOrDefaultAsync();
            var developerList = await _db.UserRoles.Where(u => u.RoleId == scrumMasterRoleId || u.RoleId == developerRoleId).Select(u => u.UserId).ToListAsync();

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

        public async Task<ProblemsListDto> GetProblemsListAsync(int? page, int? pageSize, string keyword, string[] status, string[] sprint, string[] category, string sortField, string sortOrder, string userId)
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

            IQueryable<Problem> queryProblemsDetailsDto = _db.Problems
                .Where(
                    x => x.Disable == false &&
                    x.Sprint.ProjectId == _db.Records.Where(
                            r => r.UserId == userId &&
                            r.Project.Status == Status.Active
                        ).FirstOrDefault().ProjectId)
                .Include(x => x.Sprint)
                .Include(x => x.Category)
                .OrderBy(x => x.Name);

            if (queryProblemsDetailsDto != null)
            {
                // SORT Problem CODE
                if (sortOrder == "descend" && sortField == "ProblemCode")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderByDescending(x => x.ProblemCode);
                }
                else if (sortOrder == "ascend" && sortField == "ProblemCode")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderBy(x => x.ProblemCode);
                }

                // SORT NAME
                if (sortOrder == "descend" && sortField == "name")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderByDescending(x => x.Name);
                }
                else if (sortOrder == "ascend" && sortField == "name")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderBy(x => x.Name);
                }

                // SORT STATUS
                if (sortOrder == "descend" && sortField == "status")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderByDescending(x => x.Status);
                }
                else if (sortOrder == "ascend" && sortField == "status")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderBy(x => x.Status);
                }

                // SORT SPRINT
                if (sortOrder == "descend" && sortField == "sprintName")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderByDescending(x => x.Sprint.Name);
                }
                else if (sortOrder == "ascend" && sortField == "sprintName")
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.OrderBy(x => x.Sprint.Name);
                }

                // FILTERS STATUS
                if ((status.Length > 0 && !status.Contains("All")))
                {
                    foreach (var state in status)
                    {
                        Status ProblemState;
                        queryProblemsDetailsDto = queryProblemsDetailsDto.Where(x => Enum.TryParse(state, out ProblemState) && ProblemState == x.Status);
                    }
                }

                // FILTERS SPRINT
                if ((sprint.Length > 0 && !sprint.Contains("All")))
                {
                    queryProblemsDetailsDto = queryProblemsDetailsDto.Where(x => sprint.Contains(x.Sprint.Name));
                }

                // FILTERS CATEGORY
                if ((category.Length > 0 && !category.Contains("All")))
                {
                    foreach (var categoryState in category)
                    {
                        queryProblemsDetailsDto = queryProblemsDetailsDto.Where(x => categoryState == x.Category.Name);
                    }
                }

                // SEARCH
                if (!string.IsNullOrEmpty(keyword))
                {
                    var normalizeKeyword = keyword.Trim().ToLower();
                    queryProblemsDetailsDto = queryProblemsDetailsDto.Where(
                        x => x.Name.Contains(keyword) ||
                        x.Name.Trim().ToLower().Contains(normalizeKeyword)
                        );
                }

                var pageRecords = pageSize ?? 10;
                var pageIndex = page ?? 1;
                var totalPage = queryProblemsDetailsDto.Count();
                var numberPage = Math.Ceiling((float)totalPage / pageRecords);
                var startPage = (pageIndex - 1) * pageRecords;
                if (totalPage > pageRecords)
                    queryProblemsDetailsDto = queryProblemsDetailsDto.Skip(startPage).Take(pageRecords);
                var problem = _mapper.Map<List<ProblemDetailsDto>>(queryProblemsDetailsDto);
                if (pageIndex > numberPage) pageIndex = (int)numberPage;
                var listProblemsDetailsDto = queryProblemsDetailsDto.ToList();
                var problemsDto = _mapper.Map<ProblemsListDto>(problem);
                problemsDto.TotalItem = totalPage;
                problemsDto.NumberPage = numberPage;
                problemsDto.CurrentPage = pageIndex;
                problemsDto.PageSize = pageRecords;
                return problemsDto;
            }
            return null;
        }

        public async Task<ProblemUpdateDetail> GetProblemUpdateDetailAsync(string problemId)
        {
            var problem = await _db.Problems.FindAsync(problemId);
            var sprint = await _db.Sprints.FindAsync(problem.SprintId);
            var problemDto = _mapper.Map<ProblemUpdateDetail>(problem);
            problemDto.CategoryName = await _db.Categories.Where(x => x.Id == problemDto.CategoryId).Select(x => x.Name).FirstOrDefaultAsync();
            problemDto.Sprint = _mapper.Map<SprintDetailsDto>(sprint);
            problemDto.DeveloperName = await _db.Users.Where(x => x.Id == problemDto.DeveloperId).Select(x => x.FirstName + " " + x.LastName).FirstOrDefaultAsync();
            problemDto.AssignmentName = await _db.Assignments.Where(x => x.Id == problem.AssignmentId).Select(x => x.Name).FirstOrDefaultAsync();
            return problemDto;
        }

        public async Task<Problem> CreateProblemAsync(ProblemCreateDto model)
        {
            var problemCode = await GenerateProblemCode();

            var problem = new Problem
            {
                Id = Guid.NewGuid().ToString(),
                ProblemCode = problemCode,
                Name = model.Name,
                Description = model.Description,
                Point = Convert.ToInt32(model.Point),
                Status = Status.WaitingForAcceptance,
                CategoryId = model.CategoryId,
                SprintId = model.SprintId,
                StartedDate = model.StartedDate,
                EndedDate = model.EndedDate,
                DeveloperId = model.DeveloperId,
                AssignmentId = model.AssignmentId,
            };

            await _db.AddAsync(problem);
            await _db.SaveChangesAsync();
            return problem;
        }

        public async Task<Problem> UpdateProblemAsync(ProblemUpdateDto model)
        {
            var problem = await _db.Problems.FindAsync(model.Id);
            problem.Name = model.Name;
            problem.Description = model.Description;
            problem.Point = Convert.ToInt32(model.Point);
            problem.CategoryId = model.CategoryId;
            problem.SprintId = model.SprintId;
            problem.StartedDate = model.StartedDate;
            problem.EndedDate = model.EndedDate;
            problem.DeveloperId = model.DeveloperId;

            await _db.SaveChangesAsync();
            return problem;
        }

        public async Task<Problem> DisableProblemAsync(string problemId)
        {
            var problem = await _db.Problems.FindAsync(problemId);
            problem.Disable = true;
            await _db.SaveChangesAsync();
            return problem;
        }

        private async Task<string> GenerateProblemCode()
        {
            string problemCodePrefix = "PC";
            var maxProblemCode = await _db.Problems.Where(a => a.Disable == false).OrderByDescending(a => a.ProblemCode).FirstOrDefaultAsync();
            int number = maxProblemCode != null ? Convert.ToInt32(maxProblemCode.ProblemCode.Replace(problemCodePrefix, "")) + 1 : 1;
            string newProblemCode = problemCodePrefix + number.ToString("D2");
            return newProblemCode;
        }
    }
}
