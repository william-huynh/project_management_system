using AutoMapper;
using ProjectManagementSystem.Entities;
using ProjectManagementSystem.Entities.Enum;
using ProjectManagementSystem.Models.Assignment;
using ProjectManagementSystem.Models.Category;
using ProjectManagementSystem.Models.Problem;
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
            CreateMap<Project, ProjectDetailsDto>()
                .ForMember(dest => dest.AdvisorName, act => act.MapFrom(src => src.Advisor.FirstName + " " + src.Advisor.LastName));

            CreateMap<List<ProjectDetailsDto>, ProjectsListDto>()
                .ForMember(dest => dest.Projects, act => act.MapFrom(src => src));

            // Sprint mapping profile
            CreateMap<Sprint, SprintDetailsDto>()
                .ForMember(dest => dest.Status, act => act.MapFrom(src => ((Status)src.Status).ToString()));

            CreateMap<List<SprintDetailsDto>, SprintsListDto>()
                .ForMember(dest => dest.Sprints, act => act.MapFrom(src => src));

            CreateMap<SprintCreateDto, Sprint>();

            CreateMap<Sprint, SprintDetailsDto>()
                .ReverseMap();

            // Assignment mapping profile
            CreateMap<Assignment, AssignmentDetailsDto>()
                .ForMember(dest => dest.DeveloperName, act => act.MapFrom(src => src.Developer.FirstName + " " + src.Developer.LastName))
                .ForMember(dest => dest.Category, act => act.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Status, act => act.MapFrom(src => ((Status)src.Status).ToString()));

            CreateMap<List<AssignmentDetailsDto>, AssignmentsListDto>()
                .ForMember(dest => dest.Assignments, act => act.MapFrom(src => src));

            CreateMap<Assignment, AssignmentUpdateDetail>()
                .ForMember(dest => dest.Point, act => act.MapFrom(src => src.Point.ToString()))
                .ForMember(dest => dest.Status, act => act.MapFrom(src => ((Status)src.Status).ToString()));

            // Problem mapping profile
            CreateMap<Problem, ProblemDetailsDto>()
                .ForMember(dest => dest.Category, act => act.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Status, act => act.MapFrom(src => ((Status)src.Status).ToString()));

            CreateMap<List<ProblemDetailsDto>, ProblemsListDto>()
                .ForMember(dest => dest.Problems, act => act.MapFrom(src => src));

            CreateMap<Problem, ProblemUpdateDetail>()
                .ForMember(dest => dest.Point, act => act.MapFrom(src => src.Point.ToString()))
                .ForMember(dest => dest.Status, act => act.MapFrom(src => ((Status)src.Status).ToString()));

            // Category mapping profile
            CreateMap<Category, CategoryDetailsDto>()
                .ReverseMap();
        }
    }
}
