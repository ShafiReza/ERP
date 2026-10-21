using ScopoERP.Core.HR.ViewModels;
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
    public class SecurityGuardHolidayService
    {
        private HRContext _context;
        public SecurityGuardHolidayService(HRContext context)
        {
           _context = context;
        }
        public List<SecurityGuardHolidayViewModel> GetAll()
        {
            var result = (from s in _context.SecurityGuardHoliday
                          join e in _context.Employees on s.EmployeeID equals e.EmployeeID
                          where e.IsActive == true
                          select new SecurityGuardHolidayViewModel
                          {
                              EmployeeID = s.EmployeeID,
                              Id = s.Id,
                              LastModified = s.LastModified,
                              ModifiedBy = s.ModifiedBy,
                              WeeklyHoliday = s.WeeklyHoliday,
                              CardNo = e.CardNo
                          }).ToList();
            return result;
        }

        public SecurityGuardHolidayViewModel GetById(int id)
        {
            var data = (from s in _context.SecurityGuardHoliday
                        join e in _context.Employees on s.EmployeeID equals e.EmployeeID
                        where s.Id == id
                        select new SecurityGuardHolidayViewModel
                        {
                            EmployeeID = s.EmployeeID,
                            CardNo = e.CardNo,
                            Id = s.Id,
                            LastModified = s.LastModified,
                            ModifiedBy = s.ModifiedBy,
                            WeeklyHoliday = s.WeeklyHoliday
                        }).SingleOrDefault();

            return data;
        }

        public SecurityGuardHolidayViewModel Create(SecurityGuardHolidayViewModel SecurityGuardHolidayVM)
        {
            var data = new SecurityGuardHoliday
            {
                EmployeeID = GetIdByCardNo(SecurityGuardHolidayVM.CardNo),
                Id = SecurityGuardHolidayVM.Id,
                LastModified = DateTime.Now,
                ModifiedBy = SecurityGuardHolidayVM.ModifiedBy,
                WeeklyHoliday = SecurityGuardHolidayVM.WeeklyHoliday
            };

            _context.SecurityGuardHoliday.Add(data);
            _context.SaveChanges();
            SecurityGuardHolidayVM.Id = data.Id;
            return SecurityGuardHolidayVM;

        }

        public void Update(SecurityGuardHolidayViewModel SecurityGuardHolidayVM)
        {
            var existingSecurityGuardHoliday = _context.SecurityGuardHoliday.Find(SecurityGuardHolidayVM.Id);

            if (existingSecurityGuardHoliday != null)
            {
                // Update the existing entity
                existingSecurityGuardHoliday.EmployeeID = SecurityGuardHolidayVM.EmployeeID;
                existingSecurityGuardHoliday.LastModified = DateTime.Now;
                existingSecurityGuardHoliday.ModifiedBy = SecurityGuardHolidayVM.ModifiedBy;
                existingSecurityGuardHoliday.WeeklyHoliday = SecurityGuardHolidayVM.WeeklyHoliday;


                _context.SecurityGuardHoliday.Attach(existingSecurityGuardHoliday);
                _context.Entry(existingSecurityGuardHoliday).State = EntityState.Modified;

                _context.SaveChanges();
            }
        }

        private int GetIdByCardNo(string cardno)
        {
            return (from e in _context.Employees
                    where e.CardNo == cardno
                    select e.EmployeeID).SingleOrDefault();
        }

        //public List<DropDownViewModel> GetDayDropDown()
        //{
        //    List<DropDownViewModel> list = new List<DropDownViewModel>();

        //    list.Add(new DropDownViewModel { StringValue = "Friday", Text = "Friday" });
        //    list.Add(new DropDownViewModel { StringValue = "Saturday", Text = "Saturday" });
        //    list.Add(new DropDownViewModel { StringValue = "Sunday", Text = "Sunday" });
        //    list.Add(new DropDownViewModel { StringValue = "Monday", Text = "Monday" });
        //    list.Add(new DropDownViewModel { StringValue = "Tuesday", Text = "Tuesday" });
        //    list.Add(new DropDownViewModel { StringValue = "Wednesday", Text = "Wednesday" });
        //    list.Add(new DropDownViewModel { StringValue = "Thursday", Text = "Thursday" });

        //    return list;
        //}
    }
}
