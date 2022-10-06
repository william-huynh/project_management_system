using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Misc;
using ProjectManagementSystem.Service.IServices;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IUserService _userService;

        public UsersController(UserManager<User> userManager, SignInManager<User> signInManager, IUserService userService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _userService = userService;
        }

        [HttpGet]
        [Route("get-user")]
        public async Task<IActionResult> Get()
        {
            var user = await GetCurrentUserAsync();
            var role = await GetCurrentUserRoleAsync(user);
            return Ok(new UserModel
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = role,
            });
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpGet]
        [Route("getlist")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetList(int? page, int? pageSize, string keyword, [FromQuery] string[] roles, string sortField, string sortOrder)
        {
           var users = await _userService.GetUsersListAsync(page, pageSize, keyword, roles, sortField, sortOrder);
           if (users == null) return BadRequest(users);
           return Ok(users);
        }

        private async Task<User> GetCurrentUserAsync() {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        private async Task<IList<string>> GetCurrentUserRoleAsync(User user) {
            return await _userManager.GetRolesAsync(user);
        }
    }
}
