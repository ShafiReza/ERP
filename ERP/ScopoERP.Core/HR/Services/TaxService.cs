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
    public class TaxService
    {
        private HRContext _context;
        private Tax tax;

        public TaxService(HRContext context)
        {
            this._context = context;
        }

        public List<TaxViewModel> GetAll()
        {
            var res = (from t in _context.Taxes
                       join e in _context.Employees on t.EmployeeID equals e.EmployeeID
                       select new TaxViewModel
                       {
                           EmployeeID = t.EmployeeID,
                           EmployeeName = e.EmployeeName,
                           Amount = t.Amount,
                           IsDeleted = t.IsDeleted,
                           LastModified = t.LastModified,
                           ModifiedBy = t.ModifiedBy,
                           TaxID = t.TaxID,
                           Year = t.Year
                       }).ToList();
            return res;
        }

        public void SaveTax(TaxViewModel taxVM, string name)
        {
            tax = new Tax
            {
                EmployeeID = taxVM.EmployeeID,
                Year = taxVM.Year,
                Amount = taxVM.Amount,
                IsDeleted = false,
                LastModified = DateTime.Now,
                ModifiedBy = name
            };
            _context.Taxes.Add(tax);
            _context.SaveChanges();
        }

        public void Update(TaxViewModel taxVM, string name)
        {
            // Retrieve the existing tax record from the database using the TaxID
            var existingTax = _context.Taxes.FirstOrDefault(t => t.TaxID == taxVM.TaxID);

            // Check if the existing tax record is found
            if (existingTax != null)
            {
                // Update the properties of the existing tax record
                existingTax.EmployeeID = taxVM.EmployeeID;
                existingTax.Year = taxVM.Year;
                existingTax.Amount = taxVM.Amount;
                existingTax.IsDeleted = false;
                existingTax.LastModified = DateTime.Now;
                existingTax.ModifiedBy = name;

                // Attach the existing tax record to the context and mark it as modified
                _context.Taxes.Attach(existingTax);
                _context.Entry(existingTax).State = EntityState.Modified;

                // Save the changes to the database
                _context.SaveChanges();
            }
        }

        public bool isExists(TaxViewModel taxVM)
        {
            IQueryable<int> result;

            if (taxVM.TaxID == 0)
            {
                result = (from c in _context.Taxes
                          where c.EmployeeID == taxVM.EmployeeID && taxVM.Year == c.Year
                          select c.TaxID);
            }
            else
            {
                result = (from c in _context.Taxes
                          where c.EmployeeID == taxVM.EmployeeID && taxVM.Year == c.Year && taxVM.TaxID != c.TaxID
                          select c.TaxID);
            }

            if (result.Count() > 0)
            {
                return true;
            }
            return false;

        }
    }
}
