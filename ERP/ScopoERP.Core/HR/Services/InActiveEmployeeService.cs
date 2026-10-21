using AutoMapper;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Mapper;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class InActiveEmployeeService
    {
        private HRContext _context;
        private IMapper mapper;

        public InActiveEmployeeService(HRContext context)
        {
            this._context = context;
            mapper = MapperConfigure.Initialize();
        }

        public List<InactiveEmployeeViewModel> GetAll(int pageIndex, int pageSize)
        {
            var data = (from i in _context.InactiveEmployees
                        join e in _context.Employees on i.EmployeeID equals e.EmployeeID
                        
                        select new InactiveEmployeeViewModel
                        {
                            ID = i.ID,
                            EmployeeID = i.EmployeeID,
                            EmployeeName = e.EmployeeName,
                            InActiveType= i.InActiveType,
                            ApplicableDate= i.ApplicableDate,
                            Reason= i.Reason,
                            ModifiedBy= i.ModifiedBy,
                         
                        }).AsQueryable();


            return data.OrderByDescending(o => o.ID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        }


        public InactiveEmployeeViewModel SaveInactiveEmployeeInfo(InactiveEmployeeViewModel info, string name)
        {
            var inActiveEmployee = new InactiveEmployee
            {
                EmployeeID = info.EmployeeID,
                InActiveType = info.InActiveType,
                Reason = info.Reason,
                ModifiedBy = name,
                ApplicableDate = info.ApplicableDate
            };

            _context.InactiveEmployees.Add(inActiveEmployee);

            var empInfo = (from e in _context.Employees
                           where e.EmployeeID == info.EmployeeID
                           select e).SingleOrDefault();

            empInfo.IsActive = false;
            empInfo.LastModified = DateTime.Now;
            empInfo.ModifiedBy = name;

            _context.Employees.Attach(empInfo);
            _context.Entry(empInfo).State = EntityState.Modified;

            _context.SaveChanges();

            info.ID = inActiveEmployee.ID;
            return info;

        }
    }
}
