using AutoMapper;
using ScopoERP.Core.Mapper;
using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Production.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using static AutoMapper.Internal.ExpressionFactory;

namespace ScopoERP.Production.BLL
{
    public class ProductionStatusLogic
    {
        private UnitOfWork unitOfWork;
        private DailyProductionStatus dailyProductionStatus;

        public ProductionStatusLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public IEnumerable<DailyProductionStatusViewModel> GetAllProductionStatus(DateTime? productionDate = null, int? purchaseOrderId = null, string floor = null)
        {
            var query = (from ps in unitOfWork.ProductionStatusRepository.Get()
                         join p in unitOfWork.PurchaseOrderRepository.Get() on ps.PurchaseOrderId equals p.PoStyleId
                         join s in unitOfWork.StyleRepository.Get() on p.StyleId equals s.StyleId
                         join b in unitOfWork.BuyerRepository.Get() on s.BuyerId equals b.BuyerId
                         orderby ps.ProductionDate
                         select new DailyProductionStatusViewModel
                         {
                             Id = ps.Id,
                             ProductionDate = ps.ProductionDate,
                             Floor = ps.Floor,
                             Line = ps.Line,
                             Hour = ps.Hour,

                             BuyerName = b.BuyerName,
                             StyleID = s.StyleId,
                             StyleNo = s.StyleNo,

                             PurchaseOrderID = ps.PurchaseOrderId,
                             PurchaseOrderNo = p.PoNo,
                             OrderQuantity = p.OrderQuantity,
                             AgreedCM = p.AgreedCm,
                             SAM = s.Sam ?? 0,
                             ExitDate = p.ExitDate,

                             Cutting = ps.Cutting,
                             Sewing = ps.Sewing,
                             Washing = ps.Washing,
                             Printing = ps.Printing,
                             Finishing = ps.Finishing,
                             Color = ps.Color,
                             SewingInput = ps.SewingInput,
                             FinishingInput = ps.FinishingInput,
                             SentToWash = ps.SentToWash,

                             ProduceMinutes = (ps.Sewing ?? 0) * (s.Sam ?? 0),
                             CMEarnings = (ps.Sewing ?? 0) * p.AgreedCm,

                             RunningMachine = ps.RunningMachine
                         }).AsQueryable();

            if (!String.IsNullOrEmpty(floor))
                query = query.Where(x => x.Floor == floor);

            if (productionDate != null)
                query = query.Where(x => x.ProductionDate == productionDate);

            if (purchaseOrderId != null)
                query = query.Where(x => x.PurchaseOrderID == purchaseOrderId);

            var result = query.OrderBy(x => x.Floor).ThenBy(x => x.Line).ToList();

            return result;
        }

        public void DeleteProductionStatus(int id)
        {
            var data = unitOfWork.ProductionStatusRepository.GetById(id);
            unitOfWork.ProductionStatusRepository.Delete(data);
            unitOfWork.Save();
        }

        public void SaveProductionStatus(DailyProductionStatusViewModel productionStatusVM)
        {
            if (productionStatusVM.Id > 0)
            {
                dailyProductionStatus = new DailyProductionStatus
                {
                    Id = productionStatusVM.Id,
                    PurchaseOrderId = productionStatusVM.PurchaseOrderID,
                    ProductionDate = productionStatusVM.ProductionDate,
                    Hour = productionStatusVM.Hour,
                    Floor = productionStatusVM.Floor,
                    Line = productionStatusVM.Line,
                    Cutting = productionStatusVM.Cutting,
                    Sewing = productionStatusVM.Sewing,
                    Washing = productionStatusVM.Washing,
                    Printing = productionStatusVM.Printing,
                    Finishing = productionStatusVM.Finishing,
                    RunningMachine = productionStatusVM.RunningMachine,
                    ModifiedBy = productionStatusVM.ModifiedBy,
                    ModifiedDate = DateTime.Now,
                    Color = productionStatusVM.Color,
                    SewingInput = productionStatusVM.SewingInput,
                    FinishingInput = productionStatusVM.FinishingInput,
                    SentToWash = productionStatusVM.SentToWash,

                };
                unitOfWork.ProductionStatusRepository.Update(dailyProductionStatus);
                unitOfWork.Save();
            }
            else
            {
                dailyProductionStatus = new DailyProductionStatus
                {
                    Id = productionStatusVM.Id,
                    PurchaseOrderId = productionStatusVM.PurchaseOrderID,
                    ProductionDate = productionStatusVM.ProductionDate,
                    Hour = productionStatusVM.Hour,
                    Floor = productionStatusVM.Floor,
                    Line = productionStatusVM.Line,
                    Cutting = productionStatusVM.Cutting,
                    Sewing = productionStatusVM.Sewing,
                    Washing = productionStatusVM.Washing,
                    Printing = productionStatusVM.Printing,
                    Finishing = productionStatusVM.Finishing,
                    RunningMachine = productionStatusVM.RunningMachine,
                    ModifiedBy = productionStatusVM.ModifiedBy,
                    ModifiedDate = DateTime.Now,
                    Color = productionStatusVM.Color,
                    SewingInput = productionStatusVM.SewingInput,
                    FinishingInput = productionStatusVM.FinishingInput,
                    SentToWash = productionStatusVM.SentToWash,
                };
                unitOfWork.ProductionStatusRepository.Insert(dailyProductionStatus);
                unitOfWork.Save();
            }
        }








    }
}
