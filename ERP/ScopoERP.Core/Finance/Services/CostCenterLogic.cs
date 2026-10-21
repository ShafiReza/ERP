using ScopoERP.Common.ViewModel;
using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Core.Finance.Services
{
    public class CostCenterLogic
    {
        private UnitOfWork unitOfWork;
        private CostCenter costcenter;

       
        public CostCenterLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<CostCenterViewModel> GetAllCostCenter()
        {
            var result = from c in unitOfWork.CostCenterRepository.Get()
                         where c.Status == true
                         select new CostCenterViewModel
                         {
                             CostCenterID = c.CostCenterID,
                             CostCenterName = c.CostCenterName,
                             SetupDate = c.SetupDate,
                             Status = (bool)c.Status,
                             UserID = c.UserID
                         };
            return result.OrderByDescending(x=>x.CostCenterID).ToList();
        }


        public CostCenterViewModel GetByID(int AccountID)
        {
            var costCenterVM = (from c in unitOfWork.CostCenterRepository.Get()
                                                where c.CostCenterID == AccountID
                                                select new CostCenterViewModel
                                                {
                                                    CostCenterID = c.CostCenterID,
                                                    CostCenterName = c.CostCenterName,
                                                    Status = (bool)c.Status,
                                                    UserID = c.UserID

                                                }).SingleOrDefault();
            return costCenterVM;
        }

        public void UpdateCostCenter(CostCenterViewModel costCenterVM)
        {
            costcenter = new CostCenter
            {
                CostCenterID = costCenterVM.CostCenterID,
                CostCenterName = costCenterVM.CostCenterName,
                SetupDate = DateTime.Now,
                UserID = costCenterVM.UserID,
                Status = true
            };
            unitOfWork.CostCenterRepository.Update(costcenter);
            unitOfWork.Save();
        }

        public void SaveCostCenter(CostCenterViewModel costCenterVM)
        {
            costcenter = new CostCenter
            {
                CostCenterName = costCenterVM.CostCenterName,
                SetupDate = DateTime.Now,
                UserID = costCenterVM.UserID,
                Status = true
            };
            unitOfWork.CostCenterRepository.Insert(costcenter);
            unitOfWork.Save();
        }

        public bool IsUnique(CostCenterViewModel costCenterVM)
        {
            IQueryable<int> result;

            if (costCenterVM.CostCenterID == 0)
            {
                result = (from c in unitOfWork.CostCenterRepository.Get()
                          where c.CostCenterName == costCenterVM.CostCenterName
                          select c.CostCenterID);
            }
            else
            {
                result = (from c in unitOfWork.CostCenterRepository.Get()
                          where c.CostCenterName == costCenterVM.CostCenterName && c.CostCenterID != costCenterVM.CostCenterID
                          select c.CostCenterID);
            }

            return result.Count() == 0;
        }


    }
}
