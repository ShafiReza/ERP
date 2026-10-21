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
    public class MedicineService
    {
        private Medicine medicine;



        private HRContext _context;

        public MedicineService(HRContext context)
        {
            this._context = context;
        }

        public object GetAllMedicines()
        {
            var res = (from m in _context.Medicines
                       select new MedicineViewModel
                       {
                           MedicineID = m.MedicineID,
                           MedicineName = m.MedicineName,
                           UnitPrice = m.UnitPrice
                       }).ToList();

            return res;
        }

        public void CreateMedicine(MedicineViewModel medVM, string name)
        {
            medicine = new Medicine
            {
                MedicineName = medVM.MedicineName,
                UnitPrice = medVM.UnitPrice,
                ModifiedBy = name,
                LastModified = DateTime.Now,
                IsDeleted = false
            };

            _context.Medicines.Add(medicine);
            _context.SaveChanges();
        }

        public void UpdateMedicine(MedicineViewModel medVM, string name)
        {
            // Retrieve the existing medicine record from the database using the MedicineID
            var existingMedicine = _context.Medicines.FirstOrDefault(m => m.MedicineID == medVM.MedicineID);

            // Check if the existing medicine record is found
            if (existingMedicine != null)
            {
                // Update the properties of the existing medicine record
                existingMedicine.MedicineName = medVM.MedicineName;
                existingMedicine.UnitPrice = medVM.UnitPrice;
                existingMedicine.ModifiedBy = name;
                existingMedicine.LastModified = DateTime.Now;
                existingMedicine.IsDeleted = false;

                // Attach the existing medicine record to the context and mark it as modified
                _context.Medicines.Attach(existingMedicine);
                _context.Entry(existingMedicine).State = EntityState.Modified;

                // Save the changes to the database
                _context.SaveChanges();
            }
        }
        public bool IsUnique(MedicineViewModel medVM)
        {
            IQueryable<int> result;

            if (medVM.MedicineID == 0)
            {
                result = from m in _context.Medicines
                         where m.MedicineName.ToLower().Trim() == medVM.MedicineName.ToLower().Trim()
                         select m.MedicineID;
            }
            else
            {
                result = from m in _context.Medicines
                         where m.MedicineName.ToLower().Trim() == medVM.MedicineName.ToLower().Trim() && m.MedicineID != medVM.MedicineID
                         select m.MedicineID;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
