using ScopoERP.Core.HR.ViewModels;
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
    public class LoanService
    {
        private HRContext _context;
        private Loan loan;
        private LoanDetails loanDetails;

        public LoanService(HRContext context)
        {
            this._context = context;
        }


        public List<LoanVIewModel> GetAllLoans()
        {
            List<LoanVIewModel> res = (from l in _context.Loans
                                       join e in _context.Employees on l.EmployeeID equals e.EmployeeID 
                                       select new LoanVIewModel
                                       {
                                           EmployeeID = l.EmployeeID,
                                           EmployeeName = e.EmployeeName,
                                           DisbursementDate = l.DisbursementDate,
                                           LoanAmount = l.LoanAmount,
                                           Duration = l.Duration,
                                           LoanID = l.LoanID,
                                           StartsFrom = l.StartsFrom
                                       }).ToList();
            return res;
        }

        public List<LoanDetailsViewModel> GetLoanDetailsByLoanID(int loanID)
        {
            var empid = _context.Loans.Where(e => e.LoanID == loanID).Select(s => s.EmployeeID).FirstOrDefault();

            List<LoanDetailsViewModel> res = (from l in _context.LoanDetails
                                              where l.LoanID == loanID
                                              select new LoanDetailsViewModel
                                              {
                                                  LoanID = l.LoanID,
                                                  RepaymentAmount = l.RepaymentAmount,
                                                  RepaymentDate = l.RepaymentDate,
                                                  LoanDetailsID = l.LoanDetailsID,
                                                  LoanPaid = null,
                                              }).ToList();
            var ms = _context.MonthlySalaries.Where(s => s.EmployeeId == empid && s.Loan != null).ToList();
            if (ms != null && res != null)
            {
                for (var i = 0; i < res.Count; i++)
                {
                    res[i].LoanPaid = ms.Where(f => f.Month == res[i].RepaymentDate.Month && f.Year == res[i].RepaymentDate.Year).Select(s => s.Loan).SingleOrDefault();
                }

            }

            return res;
        }

        //public void SaveAdvanceSalary(AdvanceSalaryViewModel salaryVM, string name)
        //{
        //    advanceSalary = new AdvanceSalary
        //    {
        //        CardNo = salaryVM.CardNo,
        //        Advance = salaryVM.Advance,
        //        Year = salaryVM.Year,
        //        Month = salaryVM.Month,
        //        AdvanceTaken = salaryVM.AdvanceTaken,
        //        LastModified = DateTime.Now,
        //        ModifiedBy = name,
        //        IsDeleted=false
        //    };
        //    unitOfWork.AdvanceSalaryRepository.Insert(advanceSalary);
        //    unitOfWork.Save();
        //}

        public void SaveLoan(LoanVIewModel loanVM, string name)
        {

            var loanAmount = loanVM.LoanAmount;
            //var repaymentMonth = loanVM.StartsFrom;
            var duration = loanVM.Duration;
            DateTime repaymentDate = Convert.ToDateTime(loanVM.StartsFrom + "-" + "01-" + Convert.ToDateTime(loanVM.DisbursementDate).Year);
            loan = new Loan
            {
                DisbursementDate = loanVM.DisbursementDate,
                Duration = loanVM.Duration,
                EmployeeID = loanVM.EmployeeID,
                LoanAmount = loanVM.LoanAmount,
                StartsFrom = loanVM.StartsFrom,
                ModifiedBy = name,
                LastModified = DateTime.Now,
                IsDeleted = false
            };
            _context.Loans.Add(loan);
            _context.SaveChanges();

            for (int i = 0; i < loanVM.Duration; i++)
            {
                loanDetails = new LoanDetails
                {
                    LoanID = loan.LoanID,
                    RepaymentAmount = Math.Round(loanAmount / duration, 0),
                    RepaymentDate = repaymentDate
                };

                _context.LoanDetails.Add(loanDetails);

                loanAmount = loanAmount - Math.Round(loanAmount / duration, 0);
                duration--;
                //repaymentMonth++;
                repaymentDate = Convert.ToDateTime(repaymentDate).AddMonths(1);
            }

            _context.SaveChanges();

        }
    }
}
