using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Production.ViewModel;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScopoERP.ProductionStatus.BLL
{
    public class ProductionPlanningLogic
    {
        private UnitOfWork unitOfWork;  

        public ProductionPlanningLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<ProductionPlanViewModel> GetAll()
        {
            var data = (from s in unitOfWork.ProductionPlanningRepository.Get()
                        join p in unitOfWork.PurchaseOrderRepository.Get() on s.PoStyleID equals p.PoStyleId
                        select new ProductionPlanViewModel
                        {
                            id = s.PoductionPlanningID,
                            resourceId = s.FloorLineID,
                            purchaseOrderId = p.PoStyleId,
                            title = p.PoNo,
                            start = s.StartDate,
                            end = s.EndDate
                        }).ToList();

            return data;
        }

        public void Save(List<ProductionPlanViewModel> plans)
        {
            foreach(var plan in plans)
            {
                var model = new productionplanning
                {
                    PoductionPlanningID = plan.id,
                    PoStyleID = plan.purchaseOrderId,
                    FloorLineID = plan.resourceId,
                    StartDate = plan.start,
                    EndDate = plan.end,
                    Capacity = 0
                };

                if (plan.id == 0)
                    unitOfWork.ProductionPlanningRepository.Insert(model);
                else
                    unitOfWork.ProductionPlanningRepository.Update(model);
            }
            unitOfWork.Save();
        }
    }
}
