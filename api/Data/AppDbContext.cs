using api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        protected readonly IConfiguration Configuration;

        public AppDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true); //Enable legacy timestamp behavior to prevent DateTime error
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to postgres
            options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            var hasher = new PasswordHasher<ApplicationUser>();

            builder.Entity<ApplicationUser>().HasData(
               new ApplicationUser
               {
                   Email = "email@example.com",
                   NormalizedEmail = "EMAIL@EXAMPLE.COM",
                   EmailConfirmed = true,
                   PasswordHash = hasher.HashPassword(null, "Test!2345"),
                   SecurityStamp = string.Empty
               }
           );
        }

        public DbSet<LoginActivity> LoginActivities { get; set; }
    }
}
