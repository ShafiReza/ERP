using ScopoERP.Core.Reports.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class SecurityGuardRosterService
    {
        private SecurityGuardRoster securityGuardRoster;
        private HRContext _context;
        public SecurityGuardRosterService(HRContext context)
        {
            _context = context;
        }

        public void SaveRoster(List<SecurityGuardRosterViewModel> roster, string username)
        {
            List<SecurityGuardRoster> existing = new List<SecurityGuardRoster>();
            DateTime date = roster[0].WorkingDate;

            //existing = unitOfWork.SecurityGuardRosterRepository.Get()
            //                .Where(x => x.WorkingDate == date)
            //                .Select(x => x)
            //                .ToList();

            existing = (from s in _context.SecurityGuardRosters
                        join e in _context.Employees on s.EmployeeId equals e.EmployeeID
                        where s.WorkingDate == date && e.DepartmentID == 6
                        select s).ToList();

            if (existing.Count > 0)
            {
                _context.SecurityGuardRosters.RemoveRange(existing);
                _context.SaveChanges();
            }

            foreach (var entry in roster)
            {
                securityGuardRoster = new SecurityGuardRoster
                {
                    EmployeeId = entry.EmployeeID,
                    ShiftId = entry.ShiftId,
                    WorkingDate = entry.WorkingDate,
                    PlaceOfDuty = entry.PlaceOfDuty,
                    Remarks = entry.Remarks,
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    ModifiedBy = username
                };
                _context.SecurityGuardRosters.Add(securityGuardRoster);
            }
            _context.SaveChanges();
        }

        public IEnumerable<SecurityGuardRosterViewModel> SearchRoster(DateTime date)
        {
            var res = (from r in _context.SecurityGuardRosters
                       join e in _context.Employees
                       on r.EmployeeId equals e.EmployeeID
                       join d in _context.Designations
                       on e.DesignationID equals d.DesignationID
                       where r.WorkingDate == date
                       select new SecurityGuardRosterViewModel
                       {
                           EmployeeID = r.EmployeeId,
                           WorkingDate = r.WorkingDate,
                           Id = r.Id,
                           PlaceOfDuty = r.PlaceOfDuty,
                           Remarks = r.Remarks,
                           ShiftId = r.ShiftId,
                           CardNo = e.CardNo,
                           DesignationName = d.DesignationName,
                           EmployeeName = e.EmployeeName
                       }).AsEnumerable();
            return res;
        }
    }
}
