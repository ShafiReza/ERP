using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class HolidayService
    {
        private HRContext _context;
        public HolidayService(HRContext context)
        {
            _context = context;
        }
        public List<HolidayViewModel> GetAll(int pageIndex, int pageSize, bool excelExport, string title)
        {
            var result = (from r in _context.Holidays
                          where r.IsDeleted == false
                          orderby r.HolidayId descending
                          select new HolidayViewModel
                          {
                              HolidayId = r.HolidayId,
                              BranchId = r.BranchId,
                              FromDate = r.FromDate,
                              LastModified = r.LastModified,
                              ModifiedBy = r.ModifiedBy,
                              Title = r.Title,
                              ToDate = r.ToDate,
                              IsFestive = r.IsFestive
                          }).AsQueryable();

            if (!string.IsNullOrEmpty(title))
            {
                result = result.Where(r => r.Title.Contains(title));
            }

            if (!excelExport)
            {
                result = result.Skip((pageIndex - 1) * pageSize).Take(pageSize);
            }

            return result.ToList();
        }

        public HolidayViewModel GetById(int id)
        {
            var data = (from h in _context.Holidays
                        where h.HolidayId == id
                        select new HolidayViewModel
                        {
                            HolidayId = h.HolidayId,
                            BranchId = h.BranchId,
                            FromDate = h.FromDate,
                            IsDeleted = h.IsDeleted,
                            LastModified = h.LastModified,
                            ModifiedBy = h.ModifiedBy,
                            Title = h.Title,
                            ToDate = h.ToDate,
                            IsFestive = h.IsFestive
                        }).SingleOrDefault();

            return data;
        }

        public HolidayViewModel Create(HolidayViewModel HolidayVM)
        {
            var data = new Holiday
            {
                Title = HolidayVM.Title,
                BranchId = HolidayVM.BranchId,
                FromDate = HolidayVM.FromDate,
                ToDate = HolidayVM.ToDate,
                LastModified = HolidayVM.ToDate,
                ModifiedBy = HolidayVM.ModifiedBy,
                IsDeleted = false,
                IsFestive = HolidayVM.IsFestive
            };

            _context.Holidays.Add(data);
            _context.SaveChanges();
            HolidayVM.HolidayId= data.HolidayId;
            return HolidayVM;

        }

        public void Update(HolidayViewModel HolidayVM)
        {
            var data = _context.Holidays.FirstOrDefault(h => h.HolidayId == HolidayVM.HolidayId);
            if (data != null)
            {
                data.Title = HolidayVM.Title;
                data.BranchId = HolidayVM.BranchId;
                data.FromDate = HolidayVM.FromDate;
                data.ToDate = HolidayVM.ToDate;
                data.LastModified = HolidayVM.ToDate;
                data.ModifiedBy = HolidayVM.ModifiedBy;
                data.IsDeleted = false;
                data.IsFestive = HolidayVM.IsFestive;

                _context.Holidays.Attach(data);
                _context.Entry(data).State = EntityState.Modified;

                _context.SaveChanges();
            }
        }

        public bool IsUnique(HolidayViewModel holidayVM)
        {
            IQueryable<int> result;

            if (holidayVM.HolidayId == 0)
            {
                result = from hol in _context.Holidays
                         where hol.FromDate == holidayVM.FromDate && hol.ToDate == holidayVM.ToDate
                         select hol.HolidayId;
            }
            else
            {
                result = from hol in _context.Holidays
                         where hol.FromDate == holidayVM.FromDate && hol.ToDate == holidayVM.ToDate
                         select hol.HolidayId;
            }

            return result.Count() > 0 ? false : true;
        }
    }
}
