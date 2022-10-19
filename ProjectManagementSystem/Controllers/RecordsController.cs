using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagementSystem.Service.IServices;

namespace ProjectManagementSystem.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly IRecordService _recordService;

        public RecordsController(IRecordService recordService)
        {
            _recordService = recordService;
        }

        [HttpDelete]
        [Route("delete-user-record/{userId}")]
        public async Task<IActionResult> RemoveUserRecord(string userId)
        {
            var record = await _recordService.RemoveRecordAsync(userId);
            if (record == false) BadRequest(record);
            return Ok(record);
        }
    }
}