using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.LC.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace ScopoERP.LC.BLL
{
    public class BankLogic
    {
        private UnitOfWork unitOfWork;
        private bank bank;

        public BankLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateBank(BankViewModel bankVM)
        {
            bank = new bank
            {
                BankName = bankVM.BankName,
                BankAddress = bankVM.BankAddress,
                AccountNo = bankVM.AccountNo,
                SwiftCode = bankVM.SwiftCode,
                CreditLimit = bankVM.CreditLimit,
                UserID = bankVM.UserID,
                SetDate = DateTime.Now
            };

            unitOfWork.BankRepository.Insert(bank);
            unitOfWork.Save();
        }
                
        public void UpdateBank(BankViewModel bankVM)
        {
            bank = new bank
            {
                BankID = bankVM.BankID,
                BankName = bankVM.BankName,
                BankAddress = bankVM.BankAddress,
                AccountNo = bankVM.AccountNo,
                SwiftCode = bankVM.SwiftCode,
                CreditLimit = bankVM.CreditLimit,
                UserID = bankVM.UserID,
                SetDate = DateTime.Now
            };

            unitOfWork.BankRepository.Update(bank);
            unitOfWork.Save();
        }

        public List<BankViewModel> GetAllBank()
        {
            var b2bValue = (from b in unitOfWork.BackToBackLCRepository.Get()
                            join j in unitOfWork.JobRepository.Get() on b.JobID equals j.JobInfoId
                            join bp in unitOfWork.BackToBackLCPaymentRepository.Get() on b.BackToBackLCID equals bp.BackToBackLCID into bg
                            from bc in bg.DefaultIfEmpty()
                            where j.IsClosed == false
                            group new { b, bc } by j.BankID into jg
                            select new
                            {
                                BankId = jg.Key,
                                B2BValue = jg.Sum(x => x.b.BackToBackLCValue),
                                PaymentValue = jg.Sum(x=> x.bc == null ? 0 : x.bc.PaymentValue)
                            }).AsQueryable();

            var result = (from s in unitOfWork.BankRepository.Get()
                          join b in b2bValue on s.BankID equals b.BankId into bg
                          from bc in bg.DefaultIfEmpty()
                          orderby s.BankID descending
                          select new BankViewModel
                          {
                              BankID = s.BankID,
                              BankName = s.BankName,
                              BankAddress = s.BankAddress,
                              AccountNo = s.AccountNo,
                              SwiftCode = s.SwiftCode,
                              CreditLimit = s.CreditLimit,
                              AvailableCredit = s.CreditLimit - (bc == null ? 0 : bc.B2BValue - bc.PaymentValue),
                              UserID = s.UserID,
                              SetDate = s.SetDate
                          }).ToList();
            
            return result;
        }

        public BankViewModel GetBankByID(int id)
        {
            var result = (from s in unitOfWork.BankRepository.Get()
                          where s.BankID == id
                          select new BankViewModel
                          {
                              BankID = s.BankID,
                              BankName = s.BankName,
                              BankAddress = s.BankAddress,
                              AccountNo = s.AccountNo,
                              SwiftCode = s.SwiftCode,
                              CreditLimit = s.CreditLimit,
                              UserID = s.UserID,
                              SetDate = s.SetDate
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueBank(string bankName, Nullable<int> bankID = null)
        {
            IQueryable<int> result;

            if (bankID == null)
            {
                result = from s in unitOfWork.BankRepository.Get()
                         where s.BankName == bankName
                         select s.BankID;
            }
            else
            {
                result = from s in unitOfWork.BankRepository.Get()
                         where s.BankName == bankName & s.BankID != bankID
                         select s.BankID;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
