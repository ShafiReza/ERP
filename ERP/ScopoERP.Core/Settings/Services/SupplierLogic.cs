using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Stackholder.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Stackholder.BLL
{
    public class SupplierLogic
    {
        private UnitOfWork unitOfWork;
        private supplier supplier;


        public SupplierLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

  
        public void CreateSupplier(SupplierViewModel supplierVM)
        {
            if (supplierVM.SupplierID != 0)
            {
                UpdateSupplier(supplierVM);
            }
            else
            {
                supplier = new supplier
                {
                    SupplierName = supplierVM.SupplierName,
                    Address = supplierVM.Address,
                    Email = supplierVM.Email,
                    ContactNumber = supplierVM.ContactNumber
                };

                unitOfWork.SupplierRepository.Insert(supplier);
                unitOfWork.Save();
            }

        }


        public void UpdateSupplier(SupplierViewModel supplierVM)
        {
            supplier = new supplier
            {
                SupplierId = supplierVM.SupplierID,
                SupplierName = supplierVM.SupplierName,
                Address = supplierVM.Address,
                Email = supplierVM.Email,
                ContactNumber = supplierVM.ContactNumber
            };

            unitOfWork.SupplierRepository.Update(supplier);
            unitOfWork.Save();
        }

        public List<SupplierViewModel> GetAllSupplier(bool excelExport, int pageIndex, int pageSize, string supplierName)
        {
            var result = (from s in unitOfWork.SupplierRepository.Get()
                          orderby s.SupplierId descending
                          select new SupplierViewModel
                          {
                              SupplierID = s.SupplierId,
                              SupplierName = s.SupplierName,
                              Address = s.Address,
                              Email = s.Email,
                              ContactNumber = s.ContactNumber
                          }).AsQueryable();

            if (!string.IsNullOrEmpty(supplierName))
            {
                result = result.Where(s => s.SupplierName.Contains(supplierName));
            }

            if (!excelExport)
                return result.OrderByDescending(o => o.SupplierID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            return result.OrderByDescending(x => x.SupplierID).ToList();
        }


        public SupplierViewModel GetSupplierByID(int id)
        {
            var result = (from s in unitOfWork.SupplierRepository.Get()
                          where s.SupplierId == id
                          select new SupplierViewModel
                          {
                              SupplierID = s.SupplierId,
                              SupplierName = s.SupplierName,
                              Address = s.Address,
                              Email = s.Email,
                              ContactNumber = s.ContactNumber
                          }).SingleOrDefault();

            return result;
        }


        public bool IsUniqueSupplier(string supplierName, Nullable<int> supplierID = null)
        {
            IQueryable<int> result;

            if (supplierID == null)
            {
                result = from s in unitOfWork.SupplierRepository.Get()
                         where s.SupplierName == supplierName
                         select s.SupplierId;
            }
            else
            {
                result = from s in unitOfWork.SupplierRepository.Get()
                         where s.SupplierName == supplierName & s.SupplierId != supplierID
                         select s.SupplierId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }


    }
}
