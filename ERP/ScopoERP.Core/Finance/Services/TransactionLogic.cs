using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Core.Finance.Services
{
    public class TransactionLogic
    {
        private UnitOfWork unitOfWork;
       

        public TransactionLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public bool isValidDrCrAmount(IEnumerable<TransactionDetailViewModel> transactionDetailsList)
        {
            var DrCr = (from td in transactionDetailsList
                        where td.Debit < 0 && td.Credit < 0
                        select td).FirstOrDefault();

            if (DrCr != null)
                return false;

            return true;
        }

        public bool IsDrCrAmountEqual(IEnumerable<TransactionDetailViewModel> transactionDetailList)
        {
            decimal? totalDebit = (from td in transactionDetailList
                                   select td.Debit).Sum();
            decimal? totalCredit = (from td in transactionDetailList
                                    select td.Credit).Sum();
            if (totalDebit == totalCredit)
                return true;

            return false;
        }

        public void VoucherEntry(TransactionViewModel transactionVM)
        {
            //string newTransactionNo = GenerateTransactionNo(transactionVM.BranchID, branchCode);

            TransactionUnposted transaction = new TransactionUnposted
            {
                BranchID = transactionVM.BranchID,
                GeneralParticular = transactionVM.GeneralParticular,
                EntryDate = DateTime.Now,
                ValueDate = transactionVM.ValueDate,
                VoucherTypeID = transactionVM.VoucherTypeID,
                UserID = transactionVM.CreatedBy
            };

            transaction.TransactionUnpostedDetails = new List<TransactionUnpostedDetail>();

            int serialNo = 1;
            foreach (var i in transactionVM.TransactionDetailList)
            {
                transaction.TransactionUnpostedDetails.Add(new TransactionUnpostedDetail
                {
                    AccountID = i.AccountID,                  
                    DrCrAmount = (i.Debit == 0 || i.Debit == null) ? (i.Credit.Value * -1) : i.Debit.Value,
                    CostCenterID = transactionVM.CostCenterID,
                    TransactionID = transaction.TransactionID,
                    Particular = transaction.GeneralParticular
                });

                serialNo++;
            }

            unitOfWork.TransactionUnpostedRepository.Insert(transaction);
            unitOfWork.Save();
        }

        public void VoucherEdit(TransactionViewModel transactionVM)
        {
            var transactionDetailList = (from t in unitOfWork.TransactionUnpostedDetailRepository.Get()
                                         where t.TransactionID == transactionVM.TransactionID
                                         select t).ToList();

            if (transactionDetailList.Count > 0)
            {
                unitOfWork.TransactionUnpostedDetailRepository.DeleteRange(transactionDetailList);
            }

            TransactionUnposted transaction = unitOfWork.TransactionUnpostedRepository.GetById(transactionVM.TransactionID);
            transaction.BranchID = transactionVM.BranchID;
            transaction.EntryDate = DateTime.Now;
            transaction.GeneralParticular = transactionVM.GeneralParticular;
            transaction.UserID = transactionVM.CreatedBy;
            transaction.ValueDate = transactionVM.ValueDate;

            transaction.TransactionUnpostedDetails = new List<TransactionUnpostedDetail>();

            int serialNo = 1;
            foreach (var i in transactionVM.TransactionDetailList)
            {
                transaction.TransactionUnpostedDetails.Add(new TransactionUnpostedDetail
                {
                    AccountID = i.AccountID,
                    DrCrAmount = (i.Debit == 0 || i.Debit == null) ? (i.Credit.Value * -1) : i.Debit.Value,
                    CostCenterID = transactionVM.CostCenterID,
                    TransactionID = transaction.TransactionID,
                    Particular = transaction.GeneralParticular
                });

                serialNo++;
            }

            unitOfWork.TransactionUnpostedRepository.Update(transaction);
            unitOfWork.Save();

            //return newTransactionNo;
        }

        public TransactionViewModel GetTransactionById(int Id)
        {
            var transaction = (from t in unitOfWork.TransactionUnpostedRepository.Get()
                               where t.TransactionID == Id
                               select new TransactionViewModel
                               {
                                   TransactionID = t.TransactionID,
                                   BranchID = t.BranchID,
                                   CreatedBy = t.UserID,
                                   EntryDate = t.EntryDate,
                                   ValueDate = t.ValueDate,
                                   VoucherTypeID = t.VoucherTypeID,
                                   GeneralParticular = t.GeneralParticular
                               }).SingleOrDefault();

            var transactionDetailList = (from t in unitOfWork.TransactionUnpostedDetailRepository.Get()
                                         join a in unitOfWork.SubsidiaryAccountRepository.Get() on t.AccountID equals a.AccountID
                                         where t.TransactionID == Id
                                         select new TransactionDetailViewModel
                                         {
                                             TransactionID = t.TransactionID,                                           
                                             AccountID = t.AccountID,
                                             AccountNo = a.AccountNo,
                                             AccountName = a.AccountName,
                                             Debit = t.DrCrAmount >= 0 ? t.DrCrAmount : (decimal?)null,
                                             Credit = t.DrCrAmount < 0 ? t.DrCrAmount * (-1) : (decimal?)null,
                                             Amount = t.DrCrAmount,
                                             Particulars = t.Particular,
                                             CostCenterID = t.CostCenterID
                                         }).ToList();

            transaction.TransactionDetailList = transactionDetailList;
            transaction.CostCenterID = transactionDetailList[0].CostCenterID;

            return transaction;
        }

        public List<TransactionViewModel> GetAllTransactions(int year, int month, int? branchId = null, int? voucherType = null)
        {
            var query = (from t in unitOfWork.TransactionUnpostedRepository.Get()
                        where t.ValueDate.Value.Year == year
                        && t.ValueDate.Value.Month == month
                        orderby t.TransactionID descending
                        select new TransactionViewModel
                        {
                            TransactionID = t.TransactionID,
                            BranchID = t.BranchID,
                            CreatedBy = t.UserID,
                            EntryDate = t.EntryDate,
                            ValueDate = t.ValueDate,
                            VoucherTypeID = t.VoucherTypeID,
                            GeneralParticular = t.GeneralParticular,
                            DrCrAmount = t.TransactionUnpostedDetails.Where(x=> x.DrCrAmount > 0).Sum(x=>x.DrCrAmount)
                        }).AsQueryable();

            if (branchId != null)
                query = query.Where(x => x.BranchID == branchId);

            if (voucherType != null)
                query = query.Where(x => x.VoucherTypeID == voucherType);

            return query.ToList();
        }

        public void VoucherDelete(int transactionId)
        {
            var details = (from t in unitOfWork.TransactionUnpostedDetailRepository.Get()
                                         where t.TransactionID == transactionId
                                         select t).ToList();

            if (details.Count > 0)
            {
                unitOfWork.TransactionUnpostedDetailRepository.DeleteRange(details);
            }

            var transaction = unitOfWork.TransactionUnpostedRepository.GetById(transactionId);
            unitOfWork.TransactionUnpostedRepository.Delete(transaction);

            unitOfWork.Save();
        }
    }
}
