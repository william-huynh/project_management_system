using ProjectManagementSystem.Service.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
    }
}