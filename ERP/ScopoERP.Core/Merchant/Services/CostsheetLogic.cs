using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;

namespace ScopoERP.MaterialManagement.BLL
{
    public class CostsheetLogic
    {
        private UnitOfWork unitOfWork;

        public CostsheetLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<CostsheetViewModel> GetCostSheet(int purchaseOrderId)
        {
            var data = (from c in unitOfWork.CostsheetRepository.Get()
                        join u in unitOfWork.ConsumptionUnitRepository.Get() on c.UnitId equals u.ConsumptionUnitId
                        where c.PurchaseOrderId == purchaseOrderId
                        select new CostsheetViewModel
                        {
                            CostSheetId = c.CostsheetId,
                            PurchaseOrderId = c.PurchaseOrderId,
                            ItemCategoryId = c.ItemCategoryId,
                            Consumption = c.Consumption,
                            Wastage = c.Wastage,
                            TotalQuantity = c.TotalQuantity,
                            UnitId = c.UnitId,
                            UnitName = u.UnitName,
                            UnitPrice = c.UnitPrice,
                            TotalPrice = c.TotalPrice,
                        }).ToList();

            return data;
        }

        public void SaveCostsheet(List<CostsheetViewModel> viewModels)
        {
            int purchaseOrderId = viewModels[0].PurchaseOrderId;
            var existing = unitOfWork.CostsheetRepository.Get()
                .Where(x=>x.PurchaseOrderId == purchaseOrderId).ToList();
            unitOfWork.CostsheetRepository.DeleteRange(existing);

            foreach (var item in viewModels)
            {
                var _costsheet = new Costsheet
                {
                    CostsheetId = item.CostSheetId,
                    PurchaseOrderId = item.PurchaseOrderId,
                    ItemCategoryId = item.ItemCategoryId,
                    Consumption = item.Consumption,
                    Wastage = item.Wastage,
                    TotalQuantity = item.TotalQuantity,
                    UnitId = item.UnitId,
                    UnitPrice = item.UnitPrice,
                    TotalPrice = item.TotalPrice,
                };

                unitOfWork.CostsheetRepository.Insert(_costsheet);
            }
            unitOfWork.Save();
        }

        public void DeleteCostSheet(int costsheetId)
        {
            var costsheet = unitOfWork.CostsheetRepository.Get()
                            .SingleOrDefault(x => x.CostsheetId == costsheetId);
            
            unitOfWork.CostsheetRepository.Delete(costsheet);
            unitOfWork.Save();
        }
    }
}
