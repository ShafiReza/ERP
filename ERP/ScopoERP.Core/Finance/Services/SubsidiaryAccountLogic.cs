using ScopoERP.Common.ViewModel;
using ScopoERP.Core.Enum;
using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using static System.Data.Entity.Infrastructure.Design.Executor;

namespace ScopoERP.Core.Finance.Services
{
    public class SubsidiaryAccountLogic
    {
        private UnitOfWork unitOfWork;
        private SubsidiaryAccount subsidiaryAccount;

        public SubsidiaryAccountLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public int Insert(SubsidiaryAccountViewModel AccountVM)
        {
            try
            {
                subsidiaryAccount = new SubsidiaryAccount
                {
                    AccountNo = GetNewReferenceNo(),
                    AccountName = AccountVM.AccountName,
                    ParentID = AccountVM.ParentID.Value,
                    AccountTypeID = (byte)AccountVM.AccountTypeID,
                    UserID = AccountVM.UserID,
                    BranchTypeWiseAccount = (byte)AccountVM.BranchTypeWiseAccountID,
                    CashFlowID = AccountVM.CashFlowID,
                    AccountIdentityNo = AccountVM.AccountIdentityNo,
                    IsAutoEntry = AccountVM.IsAutoEntry,
                    CreationDate = AccountVM.CreationDate,
                    ClosingDate = AccountVM.ClosingDate,
                    StatusID = (byte)AccountVM.Status
                };
                unitOfWork.SubsidiaryAccountRepository.Insert(subsidiaryAccount);
                unitOfWork.Save();

                return subsidiaryAccount.AccountID;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<SubsidiaryAccountViewModel> GetAllAccount(int pageIndex, int pageSize, bool excelExport, int? accountId, int? accountTypeId, int? parentAccountId)
        {
            var result = (from s in unitOfWork.SubsidiaryAccountRepository.Get()
                          join a in unitOfWork.AccSysAccountTypeRepository.Get() on s.AccountTypeID equals a.AccountTypeID
                          join p in unitOfWork.ParentAccountRepository.Get() on s.ParentID equals p.AccountID
                          select new SubsidiaryAccountViewModel
                          {
                              AccountID = s.AccountID,
                              AccountNo = s.AccountNo,
                              AccountName = s.AccountName,
                              ParentID = s.ParentID,
                              ParentAccountName= p.AccountName,
                              ParentAccountNo= p.AccountNo,
                              AccountTypeID = (byte)s.AccountTypeID,
                              AccountType = a.AccountTypeName,
                              UserID = s.UserID,
                              BranchTypeWiseAccountID = s.BranchTypeWiseAccount,
                              CashFlowID = s.CashFlowID,
                              AccountIdentityNo = s.AccountIdentityNo,
                              IsAutoEntry = s.IsAutoEntry,
                              CreationDate = s.CreationDate,
                              ClosingDate = s.ClosingDate,
                              Status = s.StatusID
                          }).AsQueryable();

            if (accountId != null)
            {
                result = result.Where(x => x.AccountID == accountId);
            }

            if (accountTypeId != null)
            {
                result = result.Where(x => x.AccountTypeID == accountTypeId);
            }

            if (parentAccountId != null)
            {
                result = result.Where(x => x.ParentID == parentAccountId);
            }

            if (!excelExport)
                return result.OrderByDescending(o => o.AccountID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            return result.OrderByDescending(x => x.AccountID).ToList();

        }

        public int Update(SubsidiaryAccountViewModel AccountVM)
        {
            subsidiaryAccount = new SubsidiaryAccount
            {
                AccountID = AccountVM.AccountID,
                AccountNo = AccountVM.AccountNo,
                AccountName = AccountVM.AccountName,
                ParentID = AccountVM.ParentID.Value,
                AccountTypeID = (byte)AccountVM.AccountTypeID,
                UserID = AccountVM.UserID,
                BranchTypeWiseAccount = (byte)AccountVM.BranchTypeWiseAccountID,
                CashFlowID = AccountVM.CashFlowID,
                AccountIdentityNo = AccountVM.AccountIdentityNo,
                IsAutoEntry = AccountVM.IsAutoEntry,
                CreationDate = AccountVM.CreationDate,
                ClosingDate = AccountVM.ClosingDate,
                StatusID = (byte)AccountVM.Status
            };

            unitOfWork.SubsidiaryAccountRepository.Update(subsidiaryAccount);
            unitOfWork.Save();

            return subsidiaryAccount.AccountID;
        }

        public SubsidiaryAccountViewModel GetByID(int AccountID)
        {
            SubsidiaryAccountViewModel AccountVM = (from s in unitOfWork.SubsidiaryAccountRepository.Get()
                                                    where s.AccountID == AccountID
                                                    select new SubsidiaryAccountViewModel
                                                    {
                                                        AccountID = s.AccountID,
                                                        AccountNo = s.AccountNo,
                                                        AccountName = s.AccountName,
                                                        ParentID = s.ParentID,
                                                        UserID = s.UserID
                                                    }).SingleOrDefault();

            return AccountVM;
        }

        public string GetNewReferenceNo()
        {
            string newAccountNo = string.Empty;

            var result = (from c in unitOfWork.SubsidiaryAccountRepository.Get()
                          orderby c.AccountID descending
                          select c.AccountNo).FirstOrDefault();

            if (result == null)
            {
                newAccountNo = "1001";
            }
            else
            {

                newAccountNo = (Convert.ToInt32(result) + 1).ToString();
            }
            return newAccountNo;
        }

    }
}
