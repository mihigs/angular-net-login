using api.DTOs;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Models;

namespace api.Services
{
    public class UsersService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ActivityService _activityService;

        public UsersService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, ActivityService activityService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _activityService = activityService;
        }

        public List<ApplicationUser> GetAllUsers()
        {
            try
            {
                var users = _userManager.Users.ToList<ApplicationUser>();
                return users;
            }
            catch (Exception ex)
            {
                //Log error
                throw;
            }
        }

        public async Task<string> Login(UserLogin model)
        {
            try
            {
                //Create login activity object
                var loginActivity = new LoginActivity
                {
                    Email = model.Email,
                    Success = false
                };
                var user = await _userManager.FindByNameAsync(model.Email);
                if (user == null)
                {
                    //Log activity
                    _activityService.AddLoginActivity(loginActivity);
                    return null; // User not found
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    // Generate token
                    var tokenString = GenerateJwtToken(user);

                    //Log activity
                    loginActivity.Success = true;
                    _activityService.AddLoginActivity(loginActivity);
                    // Return token
                    return tokenString;
                }
                else
                {
                    //Log activity
                    _activityService.AddLoginActivity(loginActivity);
                    return null;
                }
            }
            catch (Exception)
            {
                //Log error
                throw;
            }

        }

        public async Task<string> AddUser(UserLogin model)
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email
                };

                var result = await _userManager.CreateAsync(user, model.Password); // Create user with password
                if (result.Succeeded)
                {
                    var token = GenerateJwtToken(user); // Generate JWT token
                    return token;
                }

                return null;
            }
            catch (Exception)
            {
                //Log error
                throw;
            }
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    // Add more claims as needed
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expires = DateTime.Now.AddSeconds(Convert.ToDouble(_configuration["Jwt:AccessExpirationSeconds"]));

                var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Issuer"],
                claims,
                expires: expires,
                signingCredentials: creds
                );
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception)
            {
                //Log error
                throw;
            }
        }

        public async Task<PaginationResponseDto> FilterUsers(FilterUsersDto model)
        {
            try
            {
                var users = _userManager.Users.ToList();
                var results = new PaginationResponseDto();
                var totalCount = users.Count();
                if (!string.IsNullOrEmpty(model.Email))
                {
                    users = users.Where(u => u.Email.Contains(model.Email)).ToList();
                }
                if (!string.IsNullOrEmpty(model.SortBy))
                {
                    if (model.SortDescending == true)
                    {
                        users = users.OrderByDescending(u => u.Email).ToList();
                    }
                    else
                    {
                        users = users.OrderBy(u => u.Email).ToList();
                    }
                }
                if (model.PageNumber != null && model.PageSize != null)
                {
                    users = users.Skip((model.PageNumber.Value) * model.PageSize.Value).Take(model.PageSize.Value).ToList();
                }

                results.Rows.AddRange(users);
                results.TotalCount = totalCount;

                return results;
            }
            catch (Exception)
            {
                //Log error
                throw;
            }
        }
    }
}
