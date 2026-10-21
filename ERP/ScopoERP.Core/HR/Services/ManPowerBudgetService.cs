using AutoMapper;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Mapper;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class ManPowerBudgetService
    {
        private HRContext hrContext;
        private IMapper mapper;

        public ManPowerBudgetService( HRContext hrContext)
        {
            this.hrContext = hrContext;
            mapper = MapperConfigure.Initialize();
        }

        public List<SectionBudgetViewModel> GetAllSectionBudgets(int pageIndex, int pageSize,string floor,int? sectionId)
        {

            var groupedData = from emp in hrContext.Employees
                              join f in hrContext.ProductionFloorLines on emp.ProductionFloorLineID equals f.ProductionFloorLineID
                              where emp.IsActive == true
                              group emp by new { f.Floor, emp.SectionID } into empGroup
                              select new
                              {
                                  Floor = empGroup.Key.Floor,
                                  SectionId = empGroup.Key.SectionID,
                                  CurrentManpower = empGroup.Count(),
                              };

            var data = (from l in hrContext.SectionBudgets
                        join s in hrContext.Sections on l.SectionId equals s.SectionID
                        join g in groupedData on new { l.SectionId, l.Floor } equals new { g.SectionId, g.Floor }
                        select new SectionBudgetViewModel
                        {
                           Id= l.Id,
                           Floor= l.Floor,
                           SectionId= l.SectionId,
                           Budget= l.Budget,
                           InterimBudget= l.InterimBudget,
                           SalaryBudget= l.SalaryBudget,
                           SectionName = s.SectionName,
                           Caption= s.Caption,
                           CurrentManpower = g.CurrentManpower,
                           Balance = (int)l.InterimBudget - g.CurrentManpower
                        }).AsQueryable();

            if (sectionId != null)
                data = data.Where(x => x.SectionId == sectionId);
           if(floor!= null)
                data = data.Where(x=>x.Floor==floor);

            return data.OrderBy(x=>x.SectionName).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList(); 
        }

        public void CreateSectionBudget(SectionBudgetViewModel sectionBudgetVM)
        {

            var sectionBudget = mapper.Map<SectionBudget>(sectionBudgetVM);

            hrContext.SectionBudgets.Add(sectionBudget);
            hrContext.SaveChanges();
        }

        public void UpdateSectionBudget(SectionBudgetViewModel sectionBudgetVM)
        {


            var entity = hrContext.SectionBudgets.Find(sectionBudgetVM.Id);
            if (entity != null)
            {

                entity.Floor = sectionBudgetVM.Floor;
                entity.SectionId = sectionBudgetVM.SectionId;
                entity.Budget = sectionBudgetVM.Budget;
                entity.InterimBudget = sectionBudgetVM.InterimBudget;
                entity.SalaryBudget = sectionBudgetVM.SalaryBudget;

                hrContext.Entry(entity).State = EntityState.Modified;


                hrContext.SaveChanges();
            }
        }
    }
}
