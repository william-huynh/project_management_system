using AutoMapper;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.User;
using System.Collections.Generic;

namespace ProjectManagementSystem
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDetailsDto>()
                .ForMember(dest => dest.FullName, act => act.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.Gender, act => act.MapFrom(src => (Gender)src.Gender))
                .ReverseMap();

            CreateMap<List<UserDetailsDto>, UsersListDto>()
                .ForMember(dest => dest.Users, act => act.MapFrom(src => src));
        }
    }
}
