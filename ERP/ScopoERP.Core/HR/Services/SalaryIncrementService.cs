using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Reports.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class SalaryIncrementService
    {
        private UnitOfWork unitOfWork;
        private HRContext context;
        private SalaryIncrement salaryIncrement;
        public SalaryIncrementService(UnitOfWork unitOfWork, HRContext _context)
        {
            this.unitOfWork = unitOfWork;
            this.context = _context;
        }

        public List<IncrementReportViewModel> GetSalaryIncrement(ReportFilteringViewModel siVM, int id)
        {
            var query = $"EXEC ScopoHR..GetIncrementData '" + siVM.FromDate + "','" + siVM.ToDate + "','" + siVM.Floor + "','" + id + "','" + siVM.ShiftId + "','" + siVM.CardNo + "','" + " " + "','" + siVM.EmployeeType + "'";
            var result = unitOfWork.UserRepository.SelectQuery<IncrementReportViewModel>(query).ToList();
            return result;
        }
        public void SaveEmployeeSalaryIncrement(SalaryIncrementViewModel sIVM, string userName)
        {

            if (sIVM.SalaryIncrementID > 0)
            {
                salaryIncrement = (from s in context.SalaryIncrements
                                   where s.SalaryIncrementID == sIVM.SalaryIncrementID && s.EmployeeID == sIVM.EmployeeID
                                   select s).SingleOrDefault();

                //updateSalaryMappings(sIVM.IncrementAmount - salaryIncrement.IncrementAmount, sIVM.EmployeeID,userName);

                salaryIncrement.IncrementDate = sIVM.IncrementDate;
                salaryIncrement.IncrementAmount = sIVM.IncrementAmount;
                salaryIncrement.LastModified = DateTime.Now;
                salaryIncrement.ModifiedBy = userName;

                context.SalaryIncrements.Attach(salaryIncrement);
                context.Entry(salaryIncrement).State = EntityState.Modified;

            }
            else
            {
                //var total = 0;
                updateSalaryMappings(sIVM.IncrementAmount, sIVM.EmployeeID, userName);
                salaryIncrement = new SalaryIncrement
                {
                    IncrementDate = sIVM.IncrementDate,
                    IncrementAmount = sIVM.IncrementAmount,
                    EmployeeID = sIVM.EmployeeID,
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    ModifiedBy = userName
                };
                context.SalaryIncrements.Add(salaryIncrement);
            }
           context.SaveChanges();
        }
        private void updateSalaryMappings(decimal v, int employeeID, string userName)
        {
            decimal totalGross = 0;

            var res = (from s in context.SalaryMappings
                       where s.EmployeeID == employeeID
                       group s by s.EmployeeID into data
                       select new
                       {
                           total = data.Sum(s => s.Amount)
                       }).SingleOrDefault();

            if (res != null)
            {
                totalGross = res.total + v;

                var basicsalary = (from s in context.SalaryMappings
                                   where s.EmployeeID == employeeID && s.SalaryTypeID == 1
                                   select s).FirstOrDefault();
                basicsalary.Amount = Math.Round((totalGross - 2450) / Convert.ToDecimal(1.5));
                basicsalary.LastModified = DateTime.Now;
                basicsalary.ModifiedBy = userName;

                context.SalaryMappings.Attach(basicsalary);
                context.Entry(basicsalary).State = EntityState.Modified;


                var houseRent = (from s in context.SalaryMappings
                                 where s.EmployeeID == employeeID && s.SalaryTypeID == 6
                                 select s).FirstOrDefault();
                houseRent.Amount = Math.Round(((totalGross - 2450) / Convert.ToDecimal(1.5) * Convert.ToDecimal(0.5)));
                houseRent.LastModified = DateTime.Now;
                houseRent.ModifiedBy = userName;
                context.SalaryMappings.Attach(houseRent);
                context.Entry(houseRent).State = EntityState.Modified;
                context.SaveChanges();
            }

        }

        public void SaveSalaryIncrement(List<IncrementReportViewModel> sIVM, string name)
        {
            for (int i = 0; i < sIVM.Count(); i++)
            {

                salaryIncrement = new SalaryIncrement
                {
                    EmployeeID = sIVM[i].EmployeeID,
                    IncrementAmount = (decimal)sIVM[i].IncrementAmount,
                    IncrementDate = (DateTime)sIVM[i].IncrementDate,
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    ModifiedBy = name
                };
                context.SalaryIncrements.Add(salaryIncrement);
                updateSalaryMappings((decimal)sIVM[i].IncrementAmount, sIVM[i].EmployeeID, name);
            }
           context.SaveChanges();
        }

        public List<SalaryIncrementViewModel> GetEmployeeeSalaryIncrementDetailsById(int employeeID)
        {
            List<SalaryIncrementViewModel> res = (from s in context.SalaryIncrements
                                                  join e in context.Employees on s.EmployeeID equals e.EmployeeID
                                                  where s.EmployeeID == employeeID
                                                  select new SalaryIncrementViewModel
                                                  {
                                                      SalaryIncrementID = s.SalaryIncrementID,
                                                      EmployeeID = s.EmployeeID,
                                                      IncrementAmount = s.IncrementAmount,
                                                      IncrementDate = s.IncrementDate,
                                                      CardNo = e.CardNo
                                                  }).ToList();
            return res;
        }
    }
}
