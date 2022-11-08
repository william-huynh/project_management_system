using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementSystem.Models.Problem;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Service.IServices;
using System.Threading.Tasks;

namespace ProjectManagementSystem.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemsController : ControllerBase
    {
        private readonly IProblemService _problemService;

        public ProblemsController(IProblemService problemService)
        {
            _problemService = problemService;
        }

        [HttpGet]
        [Route("get-categories/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetCategoriesList(string userId)
        {
            var categories = await _problemService.GetCategoriesListAsync(userId);
            return Ok(categories);
        }

        [HttpPost]
        [Route("create-category")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> CreateCateogry(CategoryCreateDto model)
        {
            var category = await _problemService.CreateCategoryAsync(model);
            if (category == null) return BadRequest(category);
            return Ok(category);
        }

        [HttpGet]
        [Route("get-sprints/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetSprintsList(string userId)
        {
            var sprints = await _problemService.GetSprintsListAsync(userId);
            return Ok(sprints);
        }

        [HttpGet]
        [Route("get-filters/{userId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetFiltersList(string userId)
        {
            var filters = await _problemService.GetFilterListAsync(userId);
            return Ok(filters);
        }

        [HttpGet]
        [Route("assignment-list")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetAssignmentsList(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var assignments = await _problemService.GetAvailableAssignmentsListAsync(page, pageSize, sortField, sortOrder);
            return Ok(assignments);
        }

        [HttpGet]
        [Route("developer-list")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetDevelopersList(int? page, int? pageSize, string sortField, string sortOrder)
        {
            var developers = await _problemService.GetAvailableDeveloperListAsync(page, pageSize, sortField, sortOrder);
            return Ok(developers);
        }

        [HttpGet]
        [Route("get-list")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetProblemsList(int? page, int? pageSize, string keyword, [FromQuery] string[] status, [FromQuery] string[] sprint, [FromQuery] string[] category, string sortField, string sortOrder, string userId)
        {
            var problems = await _problemService.GetProblemsListAsync(page, pageSize, keyword, status, sprint, category, sortField, sortOrder, userId);
            if (problems == null) return BadRequest(problems);
            return Ok(problems);
        }

        [HttpGet]
        [Route("update-detail/{problemId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetProblemsUpdateDetail(string problemId)
        {
            var problems = await _problemService.GetProblemUpdateDetailAsync(problemId);
            if (problems == null) return BadRequest(problems);
            return Ok(problems);
        }

        [HttpGet]
        [Route("detail/{problemId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetProblemDetail(string problemId)
        {
            var problem = await _problemService.GetProblemDetailAsync(problemId);
            if (problem == null) return BadRequest(problem);
            return Ok(problem);
        }

        [HttpPost]
        [Route("create")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> CreateProblem([FromBody] ProblemCreateDto model)
        {
            var problem = await _problemService.CreateProblemAsync(model);
            if (problem == null) return BadRequest(problem);
            return Ok(problem);
        }

        [HttpPut]
        [Route("update/{problemId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> UpdateProblem([FromBody] ProblemUpdateDto model)
        {
            var problem = await _problemService.UpdateProblemAsync(model);
            if (problem == null) return BadRequest(problem);
            return Ok(problem);
        }

        [HttpPut]
        [Route("disable/{problemId}")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> DisableProblem(string problemId)
        {
            var problem = await _problemService.DisableProblemAsync(problemId);
            if (problem == null) return BadRequest(problem);
            return Ok(problem);
        }
    }
}
