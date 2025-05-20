using AutoMapper;
using DevVerse.API.Models.Domain;
using DevVerse.API.Models.DTOs.Auth;
using DevVerse.API.Models.DTOs.User;

namespace DevVerse.API.Models.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User -> UserDto
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.TechStack,
                opt => opt.MapFrom(src => src.UserTechs.Select(ut => ut.TechStack.Name)))
            .ForMember(dest => dest.FollowersCount,
                opt => opt.MapFrom(src => src.Followers.Count))
            .ForMember(dest => dest.FollowingCount,
                opt => opt.MapFrom(src => src.Following.Count));

        // RegisterRequestDto -> User
        CreateMap<RegisterRequestDto, User>()
            .ForMember(dest => dest.PasswordHash,
                opt => opt.Ignore()) // El hash se manejará en el servicio
            .ForMember(dest => dest.CreatedAt,
                opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt,
                opt => opt.Ignore());

        // Otros mapeos que puedas necesitar
        CreateMap<LoginRequestDto, User>();
    }
}