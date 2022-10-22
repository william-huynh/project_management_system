using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Service.IServices;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class SprintsController : ControllerBase
    {
        private readonly ISprintService _sprintService;

        public SprintsController(ISprintService sprintService)
        {
            _sprintService = sprintService;
        }

        [HttpGet]
        [Route("getlist")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetSprintsList(int? page, int? pageSize, string keyword, [FromQuery] string[] status, string sortField, string sortOrder, string userId)
        {
            var sprints = await _sprintService.GetSprintsListAsync(page, pageSize, keyword, status, sortField, sortOrder, userId);
            if (sprints == null) return BadRequest(sprints);
            return Ok(sprints);
        }

        [HttpGet]
        [Route("update-detail/{sprintId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetUpdateDetail(string sprintId)
        {
            var sprint = await _sprintService.GetUpdateSprintDetailsAsync(sprintId);
            if (sprint == null) return BadRequest(sprint);
            return Ok(sprint);
        }

        [HttpGet]
        [Route("sprint-detail/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetDetailByUserId(string userId)
        {
            var project = await _sprintService.GetProjectSprintDetail(userId);
            if (project == null) return BadRequest(project);
            return Ok(project);
        }

        [HttpPost]
        [Route("create")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> CreateSprint([FromBody] SprintCreateDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var sprint = await _sprintService.CreateSprintAsync(model);
            return Ok(sprint);
        }

        [HttpPut]
        [Route("update/{sprintId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> UpdateSprint([FromBody] SprintUpdateDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var sprint = await _sprintService.UpdateSprintAsync(model);
            return Ok(sprint);
        }

        [HttpPut]
        [Route("disable/{sprintId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> DisableSprint(string sprintId)
        {
            var sprint = await _sprintService.DisableSprintAsync(sprintId);
            if (sprint.Disable == false) return BadRequest(sprint);
            return Ok(sprint);
        }
    }
}
