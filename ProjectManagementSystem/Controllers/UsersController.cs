using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjectManagementSystem.Data;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Models.Misc;
using ProjectManagementSystem.Models.User;
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
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetList(int? page, int? pageSize, string keyword, [FromQuery] string[] roles, string sortField, string sortOrder)
        {
           var users = await _userService.GetUsersListAsync(page, pageSize, keyword, roles, sortField, sortOrder);
           if (users == null) return BadRequest(users);
           return Ok(users);
        }

        [HttpGet]
        [Route("scrum-master-list")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetAvailableScrumMasterList(int? page, int? pageSize, string sortField, string sortOrder)
        {
           var users = await _userService.GetAvailableScrumMastersListAsync(page, pageSize, sortField, sortOrder);
           if (users == null) return BadRequest(users);
           return Ok(users);
        }

        [HttpGet]
        [Route("developer-list")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetAvailableDeveloperList(int? page, int? pageSize, string sortField, string sortOrder, string developer1Id, string developer2Id, string developer3Id, string developer4Id)
        {
           var users = await _userService.GetAvailableDevelopersListAsync(page, pageSize, sortField, sortOrder, developer1Id, developer2Id, developer3Id, developer4Id);
           if (users == null) return BadRequest(users);
           return Ok(users);
        }

        [HttpGet]
        [Route("check-developer-assign-project/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> CheckDeveloperAssignProject(string userId)
        {
            var developer = await _userService.CheckDeveloperAssignedAsync(userId);
            return Ok(developer);
        }

        [HttpGet]
        [Route("check-advisor/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> CanAdvisorDisable(string userId)
        {
            var advisor = await _userService.CanAdvisorDisableAsync(userId);
            return Ok(advisor);
        }

        [HttpGet]
        [Route("check-developer/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> CanDeveloperDisable(string userId)
        {
            var developer = await _userService.CanDeveloperDisableAsync(userId);
            return Ok(developer);
        }

        [HttpGet]
        [Route("get-project-id/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetProjectId(string userId)
        {
            var projectId = await _userService.GetProjectIdAsync(userId);
            return Ok(projectId);
        }

        [HttpGet]
        [Route("detail/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetDetail(string userId)
        {
            var data = await _userService.GetUserDetailsAsync(userId);
            if (data == null) return BadRequest(data);
            return Ok(data);
        }

        [HttpGet]
        [Route("update-detail/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetUpdateDetail(string userId)
        {
            var data = await _userService.GetUserUpdateDetailsAsync(userId);
            if (data == null) return BadRequest(data);
            return Ok(data);
        }

        [HttpGet]
        [Route("profile/{userId}")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetProfileDetail(string userId)
        {
            var data = await _userService.GetUserUpdateDetailsAsync(userId);
            if (data == null) return BadRequest(data);
            return Ok(data);
        }

        [HttpPost]
        [Route("create-user")]
        //[Authorize(Roles = "ProductOwner")]
        public async Task<ActionResult> CreateUser([FromBody] UserCreateDto user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = await _userService.CreateUserAsync(user);

            return Ok(userId);
        }

        [HttpPut]
        [Route("update/{userId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> Update([FromBody] UserUpdateDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _userService.UpdateUserAsync(model);

            if (result == null)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut]
        [Route("profile/update/{userId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _userService.UpdateUserAsync(model);

            if (result == null)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        [HttpPut]
        [Route("disable-user/{userId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> Disable(string userId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _userService.DisableUserAsync(userId);
            if (result == null)
            {
                return BadRequest(result);
            }
            return Ok(result);
        }

        private async Task<User> GetCurrentUserAsync() {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        private async Task<IList<string>> GetCurrentUserRoleAsync(User user) {
            return await _userManager.GetRolesAsync(user);
        }
    }
}
