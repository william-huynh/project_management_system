using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Project;
using ProjectManagementSystem.Models.User;
using ProjectManagementSystem.Service.IServices;

namespace ProjectManagementSystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public UserService (ApplicationDbContext db, IMapper mapper, UserManager<User> userManager)
        {
            _db = db;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<UserDetailsDto> GetUserDetailsAsync(string userId)
        {
            // Get user 
            var user = await _db.Users.Where(x => x.Id == userId && x.Disable == false)
                .Select(x => new UserDetailsDto
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    PhoneNumber = x.PhoneNumber,
                    Address = x.Address,
                    Gender = ((Gender)x.Gender).ToString(),
                    DateOfBirth = x.DateOfBirth,
                    Disabled = x.Disable,
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.Id).RoleId).Name
                }).FirstOrDefaultAsync();

            // Get participated projects
            var projects = await _db.Records
                .Where(x => x.UserId == userId)
                .Select(x => new ProjectDetailsDto
                {
                    Id = x.Project.Id,
                    ProjectCode = x.Project.ProjectCode,
                    Name = x.Project.Name,
                    StartedDate = x.Project.StartedDate,
                    EndedDate = x.Project.EndedDate,
                    AdvisorName = x.Project.Advisor.FirstName + " " + x.Project.Advisor.LastName,
                    Status = ((Status)x.Project.Status).ToString(),
                })
                .ToListAsync();

            // Get advised projects
            var advisorProjects = await _db.Projects
                .Where(x => x.AdvisorId == user.Id && x.Disable == false)
                .Select(x => new ProjectDetailsDto
                {
                    Id = x.Id,
                    ProjectCode = x.ProjectCode,
                    Name = x.Name,
                    StartedDate = x.StartedDate,
                    EndedDate = x.EndedDate,
                    AdvisorName = x.Advisor.FirstName + " " + x.Advisor.LastName,
                    Status = ((Status)x.Status).ToString(),
                })
                .ToListAsync();

            if (projects.Any()) user.ParticipatedProjects = projects;
            else user.ParticipatedProjects = new List<ProjectDetailsDto>();
            if (advisorProjects.Any()) user.AdvisedProjects = advisorProjects;
            else user.AdvisedProjects = new List<ProjectDetailsDto>();

            return user;
        }

        public async Task<UserUpdateDetail> GetUserUpdateDetailsAsync(string userId)
        {
            var user = await _db.Users.Where(x => x.Id == userId)
                .Select(x => new UserUpdateDetail
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    Address = x.Address,
                    PhoneNumber = x.PhoneNumber,
                    Gender = ((Gender)x.Gender).ToString(),
                    DateOfBirth = x.DateOfBirth,
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.Id).RoleId).Name
                }).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new Exception($"Cannot find user with id: {userId}");
            }

            return user;
        }

        public async Task<UsersListDto> GetUsersListAsync(int? page, int? pageSize, string keyword, string[] roles, string sortField, string sortOrder, string projectId)
        {
            if (roles.Length == 0)
            {
                roles = new string[] { "All" };
            }

            var queryUsersDetailsDto = _db.Users
                .Where(
                    x => x.Disable == false
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
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.Id).RoleId).Name,
                    ProjectId = _db.Records.FirstOrDefault(r => r.UserId == x.Id && r.Project.Status == Status.Active && r.Project.Disable == false).ProjectId,
                    ProjectAdvisorId = _db.Projects.FirstOrDefault(p => p.AdvisorId == x.Id && p.Status == Status.Active && p.Disable == false).Id,
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

                // SORT ROLE
                if (sortOrder == "descend" && sortField == "role")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderByDescending(x => x.Role);
                }
                else if (sortOrder == "ascend" && sortField == "role")
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.OrderBy(x => x.Role);
                }

                // GET ASSIGN
                if (projectId != null)
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.Where(x => x.ProjectId == projectId);
                }

                // FILTERS
                if ((roles.Length > 0 && !roles.Contains("All")))
                {
                    queryUsersDetailsDto = queryUsersDetailsDto.Where(x => roles.Contains(x.Role));
                }

                // SEARCH
                if (!string.IsNullOrEmpty(keyword))
                {
                    var normalizeKeyword = keyword.Trim().ToLower();
                    queryUsersDetailsDto = queryUsersDetailsDto.Where(
                        x => x.UserName.Contains(keyword) ||
                        x.UserName.Trim().ToLower().Contains(normalizeKeyword) ||
                        x.UserCode.Contains(keyword) ||
                        x.UserCode.Trim().ToLower().Contains(normalizeKeyword) ||
                        x.FullName.Trim().ToLower().Contains(normalizeKeyword) ||
                        x.FullName.Contains(keyword)
                        );
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

        public async Task<UsersListDto> GetAvailableScrumMastersListAsync(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var scrumMasterList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "ScrumMaster").Id).Select(u => u.UserId).ToListAsync();
            var assignedScrumMaster = await _db.Records.Where(x => scrumMasterList.Contains(x.UserId)).Select(x => x.UserId).ToListAsync();

            var queryUsersDetailsDto = _db.Users
                .Where(
                    x => x.Disable == false &&
                    scrumMasterList.Contains(x.Id) &&
                    !assignedScrumMaster.Contains(x.Id)
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

        public async Task<UsersListDto> GetAvailableDevelopersListAsync(int? page, int? pageSize, string sortField, string sortOrder, string developer1Id, string developer2Id, string developer3Id, string developer4Id)
        {
            var developerList = await _db.UserRoles.Where(u => u.RoleId == _db.Roles.FirstOrDefault(r => r.Name == "Developer").Id).Select(u => u.UserId).ToListAsync();
            var assignedDeveloper = await _db.Records.Where(x => developerList.Contains(x.UserId)).Select(x => x.UserId).ToListAsync();

            var queryUsersDetailsDto = _db.Users
                .Where(
                    x => x.Disable == false && 
                        developerList.Contains(x.Id) &&
                        !assignedDeveloper.Contains(x.Id) &&
                        x.Id != developer1Id && 
                        x.Id != developer2Id && 
                        x.Id != developer3Id && 
                        x.Id != developer4Id
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

        public async Task<bool> CheckDeveloperAssignedAsync(string userId)
        {
            var user = await _db.Records.Where(
                x => x.UserId == userId && 
                x.Project.Status == Status.Active)
                .FirstOrDefaultAsync();
            if (user == null) return false;
            return true;
        }
        
        public async Task<bool> CanAdvisorDisableAsync(string userId)
        {
            var advisor = await _db.Projects.Where(x => x.AdvisorId == userId && x.Disable == false).FirstOrDefaultAsync();
            if (advisor == null) return true;
            return false;
        }

        public async Task<bool> CanDeveloperDisableAsync(string userId)
        {
            var developer = await _db.Records.Where(x => x.UserId == userId).FirstOrDefaultAsync();
            if (developer == null) return true;
            return false;
        }

        public async Task<string> GetProjectIdAsync(string userId)
        {
            var projectId = await _db.Records.Where(x => x.UserId == userId).Select(x => x.ProjectId).FirstOrDefaultAsync();
            return projectId;
        }

        public async Task<User> CreateUserAsync(UserCreateDto model)
        {
            string userCode = GenerateUserCode();
            string username = GenerateUserName(model.FirstName, model.LastName);
            string password = GeneratePassword(username, model.DateOfBirth);

            var user = new User
            {
                UserCode = userCode,
                UserName = username,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                Address = model.Address,
                PhoneNumber = model.PhoneNumber,
                DateOfBirth = model.DateOfBirth,
                Gender = model.Gender,
            };
            var created = await _userManager.CreateAsync(user, password);
            await _userManager.AddToRoleAsync(user, model.Role);
            return user;
        }

        public async Task<User> UpdateUserAsync(UserUpdateDto model)
        {
            var user = await _db.Users.FindAsync(model.Id);
            if (user == null) throw new Exception($"Cannot find user with id: {model.Id}");

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.DateOfBirth = model.DateOfBirth;
            user.Gender = model.Gender;
            user.Address = model.Address;
            user.PhoneNumber = model.PhoneNumber;
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<User> DisableUserAsync(string userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception($"Cannot find user with id: {userId}");
            }
            user.Disable = true;
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
            return user;
        }

        private string GenerateUserCode()
        {
            string staffPrefix = "UC";
            var maxUserCode = _db.Users.OrderByDescending(a => a.UserCode).FirstOrDefault();
            int number = maxUserCode != null ? Convert.ToInt32(maxUserCode.UserCode.Replace(staffPrefix, "")) + 1 : 1;
            string newUserCode = staffPrefix + number.ToString("D4");
            return newUserCode;
        }

        private string GenerateUserName(string firstName, string lastName)
        {
            StringBuilder username = new StringBuilder();
            username.Append(firstName.Trim().ToLower());
            List<string> words = lastName.Split(' ').ToList();

            foreach (var word in words)
            {
                username.Append(Char.ToLower(word[0]));
            };
            var userCount = _db.Users.Where(s => s.UserName.Contains(username.ToString())).ToList().Count();
            if (userCount > 0)
            {
                username.Append(userCount);
            }
            return username.ToString();
        }
        
        private string GeneratePassword(string username, DateTime dob)
        {
            string modifiedUsername = string.Concat(username[0].ToString().ToUpper(), username.AsSpan(1));
            StringBuilder password = new StringBuilder();
            password.Append(modifiedUsername);
            password.Append("@");
            string day = dob.ToString("dd");
            string month = dob.Month.ToString("D2");
            string year = dob.ToString("yyyy");
            password.Append(day);
            password.Append(month);
            password.Append(year);

            return password.ToString();
        }
    }
}