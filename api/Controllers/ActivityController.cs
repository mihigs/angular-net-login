using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("/[controller]")]
    public class ActivityController : Controller
    {
        private readonly ActivityService _activityService;
        public ActivityController(ActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet("allActivities")]
        public ActionResult GetAllActivities()
        {
            try
            {
                var activities = _activityService.GetAllLoginActivities();
                return Ok(activities);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
                throw;
            }
        }

        [HttpPost("filterActivities")]
        public async Task<ApiResponse> FilterActivities(FilterActivitiesDto model)
        {
            var response = new ApiResponse();
            try
            {
                var activities = await _activityService.FilterActivities(model);
                if (activities != null)
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Data = activities;
                    return response;
                }
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Errors.Add("No activities found");
                return response;
            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Errors.Add(ex.Message);
                return response;
                throw;
            }
        }
    }
}
