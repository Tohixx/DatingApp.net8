using System;
using System.Security.Claims;

namespace API.Extensions;

// Adds an extension method to ClaimsPrincipal to extract the username from JWT token
public static class ClaimsPrincipleExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        var username = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Cen not get username from token");
        
        return username;
    }
}
