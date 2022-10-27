﻿using Microsoft.AspNetCore.Authorization;
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
        [Route("get-categories")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetCategoriesList()
        {
            var categories = await _assignmentService.GetCategoriesListAsync();
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
        [Route("get-sprints")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> GetSprintsList()
        {
            var sprints = await _assignmentService.GetSprintsListAsync();
            return Ok(sprints);
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

        [HttpPost]
        [Route("create")]
        // [Authorize(Roles = "ScrumMaster")]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentCreateDto model)
        {
            var assignment = await _assignmentService.CreateAssignmentAsync(model);
            if (assignment == null) return BadRequest(assignment);
            return Ok(assignment);
        }
    }
}
