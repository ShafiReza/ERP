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
using static ScopoERP.Core.HR.ViewModels.VoterViewModel;

namespace ScopoERP.Core.HR.Services
{
    public class LicenseService
    {
        private HRContext _context;
        public LicenseService(HRContext context)
        {
            _context = context;
        }

        public object GetAllLicenses()
        {
            var res = (from l in _context.Licenses
                       where l.IsDeleted == false
                       select new LicenseViewModel
                       {
                           LicenseID = l.LicenseID,
                           LicenseNo = l.LicenseNo,
                           LicenseName = l.LicenseName,
                           RenewedDate = l.RenewedDate,
                           Remarks = l.Remarks,
                           LicenseValidity = l.LicenseValidity,
                           ExpiryDate = l.ExpiryDate,
                           LicenseFee = l.LicenseFee,
                           Tips = l.Tips,
                           BudgetAmount = l.BudgetAmount,
                           BudgetDate = l.BudgetDate,
                       }).ToList();

            return res;
        }

        public LicenseViewModel CreateLicense(LicenseViewModel licenseVM, string name)
        {
           var license = new License
            {
                LicenseNo = licenseVM.LicenseNo,
                LicenseName = licenseVM.LicenseName,
                LicenseValidity = licenseVM.LicenseValidity,
                RenewedDate = licenseVM.RenewedDate,
                Remarks = licenseVM.Remarks,
                ExpiryDate = licenseVM.ExpiryDate,
                LicenseFee = licenseVM.LicenseFee,
                Tips = licenseVM.Tips,
                BudgetAmount = licenseVM.BudgetAmount,
                BudgetDate = licenseVM.BudgetDate,
                IsDeleted = false,
                LastModified = DateTime.Now,
                ModifiedBy = name
            };

            _context.Licenses.Add(license);
            _context.SaveChanges();

            licenseVM.LicenseID = license.LicenseID;
            return licenseVM;
        }

        public void UpdateLicense(LicenseViewModel licenseVM, string name)
        {
            var license = _context.Licenses.Find(licenseVM.LicenseID);

            if (license != null)
            {
                license.LicenseNo = licenseVM.LicenseNo;
                license.LicenseName = licenseVM.LicenseName;
                license.LicenseValidity = licenseVM.LicenseValidity;
                license.RenewedDate = licenseVM.RenewedDate;
                license.LicenseFee = licenseVM.LicenseFee;
                license.Tips = licenseVM.Tips;
                license.BudgetAmount = licenseVM.BudgetAmount;
                license.BudgetDate = licenseVM.BudgetDate;
                license.Remarks = licenseVM.Remarks;
                license.ExpiryDate = licenseVM.ExpiryDate;
                license.IsDeleted = false;
                license.LastModified = DateTime.Now;
                license.ModifiedBy = name;

                _context.Licenses.Attach(license);
                _context.Entry(license).State = EntityState.Modified;

                _context.SaveChanges();
            }
        }

    }
}
