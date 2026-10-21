using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Core.Finance.Services
{
    public class ParentAccountLogic
    {
        private UnitOfWork unitOfWork;
        private ParentAccount parentAccount;

        public ParentAccountLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public int Insert(ParentAccountViewModel parentAccountVM)
        {
            parentAccount = new ParentAccount
            {
                AccountNo = GetNewReferenceNo(),
                AccountName = parentAccountVM.AccountName,
                AccountTypeID = (byte)parentAccountVM.AccountTypeID,
                ParentID = parentAccountVM.ParentID,
                UserID = parentAccountVM.UserID,
                CreationDate = DateTime.Now
            };
            unitOfWork.ParentAccountRepository.Insert(parentAccount);
            unitOfWork.Save();

            return parentAccount.AccountID;
        }


        public void Update(ParentAccountViewModel parentAccountVM)
        {
            parentAccount = new ParentAccount
            {
                AccountID = parentAccountVM.AccountID,
                AccountNo = parentAccountVM.AccountNo,
                AccountName = parentAccountVM.AccountName,
                AccountTypeID = (byte)parentAccountVM.AccountTypeID,
                ParentID = parentAccountVM.ParentID,
                UserID = parentAccountVM.UserID,
                CreationDate = DateTime.Now
            };
            unitOfWork.ParentAccountRepository.Update(parentAccount);
            unitOfWork.Save();

        }

        public List<ParentAccountViewModel> GetAllParentAccount(int? accountType, int? accountId)
        {

            var result = (from s in unitOfWork.ParentAccountRepository.Get()
                          join acc in unitOfWork.AccSysAccountTypeRepository.Get()
                          on s.AccountTypeID equals acc.AccountTypeID

                          select new ParentAccountViewModel
                          {
                              AccountID = s.AccountID,
                              AccountNo = s.AccountNo,
                              AccountName = s.AccountName,
                              AccountTypeID = acc.AccountTypeID,
                              ParentID = s.ParentID,
                              AccountType = acc.AccountTypeName,
                              UserID = s.UserID

                          }).AsQueryable();

            if (accountId != null)
            {
                result = result.Where(x => x.AccountID == accountId);
            }

            if (accountType != null)
            {
                result = result.Where(x => x.AccountTypeID == accountType);
            }

            return result.OrderByDescending(x=>x.AccountID).ToList();

        }

        public ParentAccountViewModel GetById(int AccountID)
        {
            ParentAccountViewModel parentAccountVM = (from p in unitOfWork.ParentAccountRepository.Get()
                                                      where p.AccountID == AccountID
                                                      select new ParentAccountViewModel
                                                      {
                                                          AccountID = p.AccountID,
                                                          AccountNo = p.AccountNo,
                                                          AccountName = p.AccountName,
                                                          AccountTypeID = p.AccountTypeID,
                                                          ParentID = p.ParentID,
                                                          UserID = p.UserID
                                                      }).SingleOrDefault();
            return parentAccountVM;
        }

        public string GetNewReferenceNo()
        {
            string newAccountNo = string.Empty;

            var result = (from c in unitOfWork.ParentAccountRepository.Get()
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
