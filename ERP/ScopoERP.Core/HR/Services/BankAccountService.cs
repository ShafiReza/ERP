using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using static ScopoERP.Core.HR.ViewModels.VoterViewModel;
using static System.Data.Entity.Infrastructure.Design.Executor;
using System.Security.Cryptography;

namespace ScopoERP.Core.HR.Services
{
    public class BankAccountService
    {
        private HRContext _context;
        private BankSalary bankSalary;

        public BankAccountService(HRContext context)
        {
            this._context = context;
        }

        public List<BankSalaryViewModel> GetAllBankAccount(int pageIndex, int pageSize, bool excelExport, int? bankAccountId)
        {
            var res = (from b in _context.BankSalaries
                       orderby b.ID descending
                       select new BankSalaryViewModel
                       {
                           ID = b.ID,
                           CardNo = b.CardNo,
                           EmployeeID = b.EmployeeID,
                           AccountNo = b.AccountNo,
                           EmployeeName = b.EmployeeName,
                           Amount = b.Amount,
                           BankName = b.BankName,
                           Company = b.Company,
                       }).AsQueryable();

            if (bankAccountId != null)
                res = res.Where(x => x.ID == bankAccountId);

            if (!excelExport)
                res = res.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return res.ToList();
        }

        public object GetEmployeeeBankAccountDetailsById(int employeeID)
        {
            var grossSalary = GetGrossSalaryOfEmployee(employeeID);
            var res = (from b in _context.BankSalaries
                       where b.EmployeeID == employeeID
                       select new BankSalaryViewModel
                       {
                           ID = b.ID,
                           CardNo = b.CardNo,
                           EmployeeID = b.EmployeeID,
                           AccountNo = b.AccountNo,
                           Company = b.Company,
                           BankName = b.BankName,
                           Amount = b.Amount,
                           GrossSalary = grossSalary
                       }).SingleOrDefault();

            return res;
        }

        public Decimal GetGrossSalaryOfEmployee(int employeeID)
        {
            ScopoContext db = new ScopoContext();
            var grossSalary = db.Database.SqlQuery<decimal>("SELECT SUM(Amount) FROM SalaryMappings where SalaryTypeID IN (1,4,5,6,7) AND EmployeeID= '" + employeeID + "' GROUP BY EmployeeID").FirstOrDefault();

            return grossSalary;
        }

        public BankSalaryViewModel Save(BankSalaryViewModel bsVM)
        {
            EmployeeViewModel empInfo = (from e in _context.Employees
                                         join d in _context.Designations on e.DesignationID equals d.DesignationID
                                         where e.EmployeeID == bsVM.EmployeeID
                                         select new EmployeeViewModel
                                         {
                                             EmployeeName = e.EmployeeName,
                                             DepartmentName = d.DesignationName,
                                             EmployeeID = e.EmployeeID,
                                             CardNo = e.CardNo
                                         }).SingleOrDefault();


                bankSalary = new BankSalary
                {
                    EmployeeID = empInfo.EmployeeID,
                    EmployeeName = empInfo.EmployeeName,
                    Designation = empInfo.DesignationName,
                    CardNo = empInfo.CardNo,
                    AccountNo = bsVM.AccountNo,
                    Company = bsVM.Company,
                    Amount = bsVM.Amount,
                    BankName = bsVM.BankName,
                    ModifiedBy = bsVM.ModifiedBy,
                    LastModified = DateTime.Now,
                    IsDeleted = false
                };

                _context.BankSalaries.Add(bankSalary);
            

            _context.SaveChanges();

            bsVM.ID = bankSalary.ID;

            return bsVM;
        }

        public void Update(BankSalaryViewModel bsVM)
        {
            EmployeeViewModel empInfo = (from e in _context.Employees
                                         join d in _context.Designations on e.DesignationID equals d.DesignationID
                                         where e.EmployeeID == bsVM.EmployeeID
                                         select new EmployeeViewModel
                                         {
                                             EmployeeName = e.EmployeeName,
                                             DepartmentName = d.DesignationName,
                                             EmployeeID = e.EmployeeID,
                                             CardNo = e.CardNo
                                         }).SingleOrDefault();

            if (bsVM.ID > 0)
            {
                var existingBankSalary = _context.BankSalaries.Find(bsVM.ID);
                if (existingBankSalary != null)
                {
                    // Update the existing entity
                    existingBankSalary.EmployeeID = empInfo.EmployeeID;
                    existingBankSalary.EmployeeName = empInfo.EmployeeName;
                    existingBankSalary.Designation = empInfo.DesignationName;
                    existingBankSalary.CardNo = empInfo.CardNo;
                    existingBankSalary.AccountNo = bsVM.AccountNo;
                    existingBankSalary.Company = bsVM.Company;
                    existingBankSalary.Amount = bsVM.Amount;
                    existingBankSalary.BankName = bsVM.BankName;
                    existingBankSalary.ModifiedBy = bsVM.ModifiedBy;
                    existingBankSalary.LastModified = DateTime.Now;
                    existingBankSalary.IsDeleted = false;

                    _context.BankSalaries.Attach(existingBankSalary);
                    _context.Entry(existingBankSalary).State = EntityState.Modified;

                    _context.SaveChanges();
                }


            }

            
        }

        public bool IsUniqueAccount(int employeeID, string bank)
        {
            var result = (from b in _context.BankSalaries
                          where b.EmployeeID == employeeID && b.BankName == bank
                          select b).ToList();

            if (result.Count > 0)
            {
                return true;
            }

            return false;
        }
    }
}
