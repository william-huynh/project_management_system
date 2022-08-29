using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RookieOnlineAssetManagement.Data;
using RookieOnlineAssetManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RookieOnlineAssetManagement.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ApplicationDbContext _dbContext;

        public UsersController(ILogger<UsersController> logger, ApplicationDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> Get()
        {
            _logger.LogInformation("Getting all products");
            return Ok(await _dbContext.Users.Select(x => new UserModel
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email
            }).ToListAsync());
        }
    }
}
