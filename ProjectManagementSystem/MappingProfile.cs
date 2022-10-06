using AutoMapper;
using ProjectManagementSystem.Models.User;
using System.Collections.Generic;

namespace ProjectManagementSystem
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<List<UserDetailsDto>, UsersListDto>()
                .ForMember(dest => dest.Users, act => act.MapFrom(src => src));
        }
    }
}
