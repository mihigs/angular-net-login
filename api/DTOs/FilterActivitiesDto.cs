namespace api.DTOs
{
    public class FilterUsersDto
    {
        public string? Email { get; set; }
        public string? SortBy { get; set; }
        public bool? SortDescending { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
    }
}
