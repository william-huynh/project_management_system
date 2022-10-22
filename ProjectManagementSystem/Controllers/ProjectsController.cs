using ProjectManagementSystem.Service.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ProjectManagementSystem.Models.Project;

namespace ProjectManagementSystem.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        
        public ProjectsController (IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        [Route("getlist")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetList(int? page, int? pageSize, string keyword, [FromQuery] string[] status, string sortField, string sortOrder)
        {
           var projects = await _projectService.GetProjectsListAsync(page, pageSize, keyword, status, sortField, sortOrder);
           if (projects == null) return BadRequest(projects);
           return Ok(projects);
        }

        [HttpGet]
        [Route("get-manage-list")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetManageList(int? page, int? pageSize, string keyword, [FromQuery] string[] status, string sortField, string sortOrder, string advisorId)
        {
           var projects = await _projectService.GetManageProjectsListAsync(page, pageSize, keyword, status, sortField, sortOrder, advisorId);
           if (projects == null) return BadRequest(projects);
           return Ok(projects);
        }

        [HttpGet]
        [Route("detail/{projectId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetDetail(string projectId)
        {
            var project = await _projectService.GetProjectDetailsAsync(projectId);
            if (project == null) return BadRequest(project);
            return Ok(project);
        }

        [HttpPost]
        [Route("create-project")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectCreateDto project)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var projectCreated = await _projectService.CreateProjectAsync(project);
            return Ok(projectCreated);
        }

        [HttpGet]
        [Route("update-detail/{projectId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> GetUpdateDetail(string projectId)
        {
            var projectDetail = await _projectService.GetProjectUpdateDetailAsync(projectId);
            if (projectDetail == null) BadRequest(projectDetail);
            return Ok(projectDetail);
        }

        [HttpPut]
        [Route("update/{projectId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> UpdateProject([FromBody] ProjectUpdateDto project)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var projectUpdated = await _projectService.UpdateProjectAsync(project);
            if (projectUpdated == null) return BadRequest(projectUpdated);
            return Ok(projectUpdated);
        }

        [HttpPut]
        [Route("disable-project/{projectId}")]
        // [Authorize(Roles = "ProductOwner")]
        public async Task<IActionResult> DisableProject(string projectId)
        {
            var projectUpdated = await _projectService.DisableProjectAsync(projectId);
            if (projectUpdated == null) return BadRequest(projectUpdated);
            return Ok(projectUpdated);
        }
    }
}