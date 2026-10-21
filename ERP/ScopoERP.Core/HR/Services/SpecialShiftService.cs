using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Production.ViewModels;
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
    public class SpecialShiftService
    {
        private HRContext _context;

        public SpecialShiftService(HRContext context)
        {
            this._context = context;
        }

        public List<SpecialShiftViewModel> GetAllSpecialShift(int pageIndex, int pageSize, DateTime? fromDate, DateTime? toDate)
        {
            var data = (from d in _context.SpecialShifts
                        join s in _context.WorkingShifts on d.ShiftID equals s.Id
                        select new SpecialShiftViewModel
                        {
                            ID = d.ID,
                            ShiftID = d.ShiftID,
                            ShiftName = s.Name,
                            InTime = d.InTime,
                            OutTime = d.OutTime,
                            CrossesDay = d.CrossesDay,
                            WorkingDate = d.WorkingDate,

                        }).AsQueryable();

            if (fromDate != null && toDate != null) {
                data = data.Where(d=>d.WorkingDate >= fromDate && d.WorkingDate <= toDate);
            }

            var result = data.OrderByDescending(o => o.ID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            foreach (var d in result)
            {
                d.InTimeString = d.InTime?.ToString("yyyy-MM-dd HH:mm");
                d.OutTimeString = d.OutTime?.ToString("yyyy-MM-dd HH:mm");
            }

            return result;
        }



        public void Update(SpecialShiftViewModel specialShiftVM)
        {
            var specialShift = new SpecialShift
            {
                ID = specialShiftVM.ID,
                ShiftID = specialShiftVM.ShiftID,
                InTime = specialShiftVM.InTime,
                OutTime = specialShiftVM.OutTime,
                CrossesDay = specialShiftVM.CrossesDay,
                WorkingDate = specialShiftVM.WorkingDate,
            };

            if (specialShift != null)
            {
                _context.SpecialShifts.Attach(specialShift);
                _context.Entry(specialShift).State = EntityState.Modified;

                _context.SaveChanges();
            }
        }

        public void Create(SpecialShiftViewModel specialShiftVM)
        {
            var specialShift = new SpecialShift
            {
                ShiftID = specialShiftVM.ShiftID,
                InTime = specialShiftVM.InTime,
                OutTime = specialShiftVM.OutTime,
                CrossesDay = specialShiftVM.CrossesDay,
                WorkingDate = specialShiftVM.WorkingDate,
            };
            _context.SpecialShifts.Add(specialShift);
            _context.SaveChanges();
        }
    }
}
