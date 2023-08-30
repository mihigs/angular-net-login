using Microsoft.AspNetCore.Identity;

namespace api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.Now;
    }
}