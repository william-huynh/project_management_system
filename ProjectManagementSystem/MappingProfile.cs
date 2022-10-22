using AutoMapper;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Project;
using ProjectManagementSystem.Models.Sprint;
using ProjectManagementSystem.Models.User;
using System.Collections.Generic;

namespace ProjectManagementSystem
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mapping profile
            CreateMap<User, UserDetailsDto>()
                .ForMember(dest => dest.FullName, act => act.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.Gender, act => act.MapFrom(src => (Gender)src.Gender))
                .ReverseMap();

            CreateMap<List<UserDetailsDto>, UsersListDto>()
                .ForMember(dest => dest.Users, act => act.MapFrom(src => src));

            // Project mapping profile
            CreateMap<List<ProjectDetailsDto>, ProjectsListDto>()
                .ForMember(dest => dest.Projects, act => act.MapFrom(src => src));

            // Sprint mapping profile
            CreateMap<List<SprintDetailsDto>, SprintsListDto>()
                .ForMember(dest => dest.Sprints, act => act.MapFrom(src => src));

            CreateMap<SprintCreateDto, Sprint>();
        }
    }
}
