using api.DTOs;
using api.Models;
using Humanizer;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Text;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using System.Net;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/[controller]")]
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UsersService _usersService;

        public UserController(UserManager<ApplicationUser> userManager, UsersService usersService)
        {
            _userManager = userManager;
            _usersService = usersService;
        }

        [HttpGet("allUsers")]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var users = _userManager.Users.ToList();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLogin model)
        {
            var token = await _usersService.Login(model);
            if (token != null)
            {
                return Ok(new{ token });
            }
            return Unauthorized(); // Invalid login credentials or the user does not exist
        }

        [HttpPost("newUser")]
        public async Task<IActionResult> AddUser(UserLogin model)
        {
            var token = await _usersService.AddUser(model);
            if (token != null)
            {
                return Ok(new { token });
            }
            return BadRequest();
        }

        [HttpPost("filterUsers")]
        public async Task<ApiResponse> FilterUsers(FilterUsersDto filterUsersDto)
        {
            var response = new ApiResponse();

            try
            {
                var filteredUsers = await _usersService.FilterUsers(filterUsersDto);
                if (filteredUsers == null)
                {
                    response.Errors.Add("No users found");
                    response.StatusCode = HttpStatusCode.NotFound;
                    return response;
                }
                response.StatusCode = HttpStatusCode.OK;
                response.Data = filteredUsers;
                return response;
            }
            catch (Exception ex)
            {
                //Log exception
                throw;
            }
        }
    }
}
