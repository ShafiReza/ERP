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
    public class FineService
    {
        private Fine fine;
        private HRContext _context;

        public FineService(HRContext context)
        {
            this._context = context;
        }

        public List<FineViewModel> GetAll()
        {
            var res = (from f in _context.Fines
                       join e in _context.Employees on f.EmployeeID equals e.EmployeeID
                       select new FineViewModel
                       {
                           EmployeeID = f.EmployeeID,
                           EmployeeName = e.EmployeeName,
                           Amount = f.Amount,
                           Date = f.Date,
                           FineID = f.FineID,
                           LastModified = f.LastModified
                       }).ToList();
            return res;
        }

        public void SaveFine(FineViewModel fineVM, string name)
        {
            fine = new Fine
            {
                EmployeeID = fineVM.EmployeeID,
                Amount = fineVM.Amount,
                Date = fineVM.Date,
                IsDeleted = false,
                LastModified = DateTime.Now,
                ModifiedBy = name
            };
            _context.Fines.Add(fine);
            _context.SaveChanges();
        }

        public void Update(FineViewModel fineVM, string name)
        {
            var existingFine = _context.Fines.FirstOrDefault(t => t.FineID == fineVM.FineID);

            // Check if the existing fine record is found
            if (existingFine != null)
            {
                // Update the properties of the existing fine record
                existingFine.EmployeeID = fineVM.EmployeeID;
                existingFine.Date = fineVM.Date;
                existingFine.Amount = fineVM.Amount;
                existingFine.IsDeleted = false;
                existingFine.LastModified = DateTime.Now;
                existingFine.ModifiedBy = name;

                // Attach the existing tax record to the context and mark it as modified
                _context.Fines.Attach(existingFine);
                _context.Entry(existingFine).State = EntityState.Modified;

                // Save the changes to the database
                _context.SaveChanges();
            }
        }
    }
}
