using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.User;
using ProjectManagementSystem.Service.IServices;

namespace ProjectManagementSystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;
        //private readonly IHttpContextAccessor _httpContext;
        private readonly UserManager<User> _userManager;

        public UserService (ApplicationDbContext db, IMapper mapper, UserManager<User> userManager)
        {
            _db = db;
            _mapper = mapper;
            //httpContext = _httpContext;
            _userManager = userManager;
        }

        public async Task<UsersListDto> GetUsersListAsync(int? page, int? pageSize, string keyword, string[] roles, string sortField, string sortOrder)
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
                    UserName = x.UserName,
                    FullName = x.FirstName + " " + x.LastName,
                    Gender = ((Gender)x.Gender).ToString(),
                    DateOfBirth = x.DateOfBirth,
                    Disabled = x.Disable,
                    Role = _db.Roles.FirstOrDefault(r => r.Id == _db.UserRoles.FirstOrDefault(u => u.UserId == x.Id).RoleId).Name
                });
            if (queryUsersDetailsDto != null)
            {
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
    }
}