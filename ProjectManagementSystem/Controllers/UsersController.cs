using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models;
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
        private readonly ILogger _logger;
        private readonly UserManager<User> _userManager;

        public UsersController(ILogger<UsersController> logger, UserManager<User> userManager)
        {
            _logger = logger;
            _userManager = userManager;
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

        private async Task<User> GetCurrentUserAsync() {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        private async Task<IList<string>> GetCurrentUserRoleAsync(User user) {
            return await _userManager.GetRolesAsync(user);
        }
    }
}
