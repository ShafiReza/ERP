using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using ScopoERP.Common.ViewModel;
using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Store.ViewModel;


namespace ScopoERP.Core.Mapper
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Employee, EmployeeViewModel>().ReverseMap();
            CreateMap<SectionBudget, SectionBudgetViewModel>().ReverseMap();
            CreateMap<LeaveApplication, LeaveApplicationViewModel>().ReverseMap();
            CreateMap<SalaryIncrement, SalaryIncrementViewModel>().ReverseMap();
            CreateMap<Promotion, PromotionViewModel>().ReverseMap();
            CreateMap<InactiveEmployee, InactiveEmployeeViewModel>().ReverseMap();
            CreateMap<HourlyProductionStatus, HourlyProductionStatusViewModel>().ReverseMap();
            CreateMap<Timelines, TimelineViewModel>().ReverseMap();
            CreateMap<InventoryIssue, InventoryIssueViewModel>().ReverseMap();
            CreateMap<Attendance, AttendanceViewModel>().ReverseMap();
        }
    }

    public static class MapperConfigure
    {
        public static IMapper Initialize()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MapperProfile>();
            });

            return config.CreateMapper();
        }
    }
}