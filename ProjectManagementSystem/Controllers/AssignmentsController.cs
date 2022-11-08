using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Service.IServices;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;

        public AssignmentsController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet]
        [Route("get-categories/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetCategoriesList(string userId)
        {
            var categories = await _assignmentService.GetCategoriesListAsync(userId);
            return Ok(categories);
        }

        [HttpPost]
        [Route("create-category")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> CreateCateogry(CategoryCreateDto model)
        {
            var category = await _assignmentService.CreateCategoryAsync(model);
            if (category == null) return BadRequest(category);
            return Ok(category);
        }

        [HttpGet]
        [Route("get-sprints/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetSprintsList(string userId)
        {
            var sprints = await _assignmentService.GetSprintsListAsync(userId);
            return Ok(sprints);
        }

        [HttpGet]
        [Route("get-filters/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetFiltersList(string userId)
        {
            var filters = await _assignmentService.GetFilterListAsync(userId);
            return Ok(filters);
        }

        [HttpGet]
        [Route("developer-list")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetDevelopersList(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var sprints = await _assignmentService.GetAvailableDeveloperListAsync(page, pageSize, sortField, sortOrder);
            return Ok(sprints);
        }

        [HttpGet]
        [Route("get-list")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetAssignmentsList(int? page, int? pageSize, string keyword, [FromQuery] string[] status, [FromQuery] string[] sprint, [FromQuery] string[] category, string sortField, string sortOrder, string userId)
        {
            var assignments = await _assignmentService.GetAssignmentsListAsync(page, pageSize, keyword, status, sprint, category, sortField, sortOrder, userId);
            if (assignments == null) return BadRequest(assignments);
            return Ok(assignments);
        }

        [HttpGet]
        [Route("get-assigned-list")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetAssignedAssignmentsList(int? page, int? pageSize, string keyword, [FromQuery] string[] status, [FromQuery] string[] sprint, [FromQuery] string[] category, string sortField, string sortOrder, string userId)
        {
            var assignments = await _assignmentService.GetAssignedAssignmentsListAsync(page, pageSize, keyword, status, sprint, category, sortField, sortOrder, userId);
            if (assignments == null) return BadRequest(assignments);
            return Ok(assignments);
        }

        [HttpGet]
        [Route("get-assigned-board/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetAssignedAssignmentsBoard(string userId)
        {
            var assignments = await _assignmentService.GetBoardAssignmentsListAsync(userId);
            if (assignments == null) return BadRequest(assignments);
            return Ok(assignments);
        }

        [HttpGet]
        [Route("detail/{assignmentId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetAssignmentsDetail(string assignmentId)
        {
            var assignments = await _assignmentService.GetAssignmentDetailAsync(assignmentId);
            if (assignments == null) return BadRequest(assignments);
            return Ok(assignments);
        }

        [HttpGet]
        [Route("update-detail/{assignmentId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetAssignmentsUpdateDetail(string assignmentId)
        {
            var assignments = await _assignmentService.GetAssignmentUpdateDetailAsync(assignmentId);
            if (assignments == null) return BadRequest(assignments);
            return Ok(assignments);
        }

        [HttpPost]
        [Route("create")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentCreateDto model)
        {
            var assignment = await _assignmentService.CreateAssignmentAsync(model);
            if (assignment == null) return BadRequest(assignment);
            return Ok(assignment);
        }

        [HttpPut]
        [Route("update/{assignmentId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> UpdateAssignment([FromBody] AssignmentUpdateDto model)
        {
            var assignment = await _assignmentService.UpdateAssignmentAsync(model);
            if (assignment == null) return BadRequest(assignment);
            return Ok(assignment);
        }

        [HttpPut]
        [Route("accept-assignment/{assignmentId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> AcceptAssignment(string assignmentId)
        {
            var assignment = await _assignmentService.AcceptAssignmentAsync(assignmentId);
            if (assignment == null) return BadRequest(assignment);
            return Ok(assignment);
        }

        [HttpPut]
        [Route("update-status/{assignmentId}/{status}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> UpdateAssignmentStatus(string assignmentId, string status)
        {
            var assignment = await _assignmentService.UpdateAssignmentStatusAsync(assignmentId, status);
            if (assignment == null) return BadRequest(assignment);
            return Ok(assignment);
        }

        [HttpPut]
        [Route("disable/{assignmentId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> DisableAssignment(string assignmentId)
        {
            var assignment = await _assignmentService.DisableAssignmentAsync(assignmentId);
            if (assignment == null) return BadRequest(assignment);
            return Ok(assignment);
        }
    }
}
