using ScopoERP.Commercial.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.LC.BLL
{
    public class JobLogic
    {
        private UnitOfWork unitOfWork;
        private jobinfo jobinfo;

        public JobLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateJob(JobViewModel jobVM, string user)
        {
            jobinfo = new jobinfo
            {
   
                JobNo = jobVM.JobNo,
                ContractNo = jobVM.ContractNo,
                ExtraContractNo = jobVM.ExtraContractNo,
                BankID = jobVM.BankID,
                ContractDate = jobVM.ContractDate,
                AccountId = jobVM.AccountID,
                CompanyID=jobVM.CompanyID,
                IsClosed = false    ,
               BuyerID=jobVM.BuyerID,
               ModifiedBy = user,
            };

            unitOfWork.JobRepository.Insert(jobinfo);
            unitOfWork.Save();
        }

        public void UpdateJob(JobViewModel jobVM)
        {
            jobinfo = unitOfWork.JobRepository.GetById(jobVM.JobId);

            jobinfo.JobInfoId = jobVM.JobId;
            jobinfo.JobNo = jobVM.JobNo;
            jobinfo.ContractNo = jobVM.ContractNo;
            jobinfo.ExtraContractNo = jobVM.ExtraContractNo;
            jobinfo.BankID = jobVM.BankID;
            jobinfo.UDNo = jobVM.UDNo;
            jobinfo.UDDate = jobVM.UDDate;
            jobinfo.ContractDate = jobVM.ContractDate;
            jobinfo.AccountId = jobVM.AccountID;
            jobinfo.CompanyID = jobVM.CompanyID;
            jobinfo.BuyerID = jobVM.BuyerID;
            jobinfo.LastModifiedDate = DateTime.Now;

            unitOfWork.JobRepository.Update(jobinfo);
            unitOfWork.Save();
        }

        public List<JobViewModel> GetAllJob(int? jobId)
        {
            var query = (from j in unitOfWork.JobRepository.Get()
                          join bk in unitOfWork.BankRepository.Get() on j.BankID equals bk.BankID into bg
                          from b in bg.DefaultIfEmpty()
                          select new { j, b }).AsQueryable();

            if (jobId != null)
                query = query.Where(x => x.j.JobInfoId == jobId);

            query = query.OrderByDescending(x => x.j.JobInfoId).Take(10);

            var data = (from x in query
                       select new JobViewModel
                       {
                           JobId = x.j.JobInfoId,
                           JobNo = x.j.JobNo,
                           ContractNo = x.j.ContractNo,
                           ExtraContractNo = x.j.ExtraContractNo,
                           BankID = x.b.BankID,
                           BankName = x.b.BankName,

                           UDNo = x.j.UDNo,
                           UDDate = x.j.UDDate,
                           ContractDate = x.j.ContractDate,
                           IsClosed = x.j.IsClosed,
                           AccountID = x.j.AccountId,
                           BuyerID = x.j.BuyerID,
                           CompanyID = x.j.CompanyID,
                           ModifiedBy= x.j.ModifiedBy,
                           LastModifiedDate= x.j.LastModifiedDate,

                       }).ToList();

            return data;
        }

        public JobViewModel GetJobByID(int id)
        {
            var result = (from s in unitOfWork.JobRepository.Get()
                          join bk in unitOfWork.BankRepository.Get() on s.BankID equals bk.BankID into bg
                          from b in bg.DefaultIfEmpty()
                          where s.JobInfoId == id
                          select new JobViewModel
                          {
                              JobId = s.JobInfoId,
                              JobNo = s.JobNo,
                              ContractNo = s.ContractNo,
                              ExtraContractNo = s.ExtraContractNo,
                              BankID = b.BankID,
                              BankName = b.BankName,
                              UDNo = s.UDNo,
                              UDDate = s.UDDate,
                              ContractDate = s.ContractDate,
                              AccountID = s.AccountId,
                              CompanyID=s.CompanyID,
                              BuyerID=s.BuyerID,
                              IsClosed = s.IsClosed
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueJob(string jobNo, Nullable<int> jobID = null)
        {
            IQueryable<int> result;

            if (jobID == null)
            {
                result = from s in unitOfWork.JobRepository.Get()
                         where s.JobNo == jobNo
                         select s.JobInfoId;
            }
            else
            {
                result = from s in unitOfWork.JobRepository.Get()
                         where s.JobNo == jobNo & s.JobInfoId != jobID
                         select s.JobInfoId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }

        public List<JobBudgetViewModel> GetJobBudgetReport(int? jobId)
        {
            var data = (from p in unitOfWork.PurchaseOrderRepository.Get()
                        join s in unitOfWork.StyleRepository.Get() on p.StyleId equals s.StyleId
                        join c in unitOfWork.CostsheetRepository.Get() on p.PoStyleId equals c.PurchaseOrderId into cg
                        from cs in cg.DefaultIfEmpty()
                        where p.JobId == jobId
                        group cs by new { p.PoNo, p.OrderQuantity, p.Fob, p.AgreedCm, s.StyleNo } into g
                        select new JobBudgetViewModel
                        {
                            StyleNo = g.Key.StyleNo,
                            PONo = g.Key.PoNo,
                            OrderQuantity = g.Key.OrderQuantity,
                            FOB = g.Key.Fob,
                            AgreedCM = g.Key.AgreedCm,
                            RMBudget = g.Key.Fob - g.Key.AgreedCm,
                            TotalRMBudget = (g.Key.Fob - g.Key.AgreedCm) * g.Key.OrderQuantity,

                            FabricsCost = g.Sum(x => x.ItemCategoryId == 9 ? x.TotalPrice : 0),
                            WashCost = g.Sum(x => x.ItemCategoryId == 33 ? x.TotalPrice : 0),
                            TrimsCost = g.Sum(x => x.ItemCategoryId == 9 && x.ItemCategoryId == 33 ? 0 : x.TotalPrice),
                            TotalCost = g.Sum(x => x.TotalPrice)
                        }).ToList();

            return data;
        }
    }
}
