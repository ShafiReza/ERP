using ScopoERP.Common.ViewModel;
using ScopoERP.Core.Common.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;


namespace ScopoERP.OrderManagement.BLL
{
    public class PurchaseOrderLogic
    {
        private UnitOfWork unitOfWork;
        private postyle poStyle;

        public PurchaseOrderLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreatePurchaseOrder(PurchaseOrderViewModel purchaseOrderVM)
        {
            poStyle = new postyle
            {
                JobId = purchaseOrderVM.JobID,
                StyleId = purchaseOrderVM.StyleID,
                PoNo = purchaseOrderVM.PurchaseOrderNo,
                MasterPO = purchaseOrderVM.MasterPO,
                Fob = purchaseOrderVM.FOB,
                AgreedCm = purchaseOrderVM.AgreedCM,
                OrderQuantity = purchaseOrderVM.OrderQuantity,
                ExitDate = purchaseOrderVM.ExitDate,
                Destination = purchaseOrderVM.Destination,
                FactoryId = purchaseOrderVM.FactoryID,
                SubContractRate = purchaseOrderVM.SubContractRate,
                FactoryCM = purchaseOrderVM.FactoryCM,
                SeasonId = purchaseOrderVM.SeasonID,
                ShipMode = purchaseOrderVM.ShipMode,
                CurrentStatus = purchaseOrderVM.CurrentStatus,
                Remarks = purchaseOrderVM.Remarks,
                UnitID=purchaseOrderVM.UnitID,
                Sam=purchaseOrderVM.Sam,
            };

            unitOfWork.PurchaseOrderRepository.Insert(poStyle);
            unitOfWork.Save();
        }

        public void UpdatePurchaseOrder(PurchaseOrderViewModel purchaseOrderVM)
        {
            var poStyle = unitOfWork.PurchaseOrderRepository.Get().SingleOrDefault(x => x.PoStyleId == purchaseOrderVM.PurchaseOrderID);

            poStyle.PoStyleId = purchaseOrderVM.PurchaseOrderID;
            poStyle.JobId = purchaseOrderVM.JobID;
            poStyle.StyleId = purchaseOrderVM.StyleID;
            poStyle.PoNo = purchaseOrderVM.PurchaseOrderNo;
            poStyle.MasterPO = purchaseOrderVM.MasterPO;
            poStyle.Fob = purchaseOrderVM.FOB;
            poStyle.AgreedCm = purchaseOrderVM.AgreedCM;
            poStyle.OrderQuantity = purchaseOrderVM.OrderQuantity;
            poStyle.ExitDate = purchaseOrderVM.ExitDate;
            poStyle.FactoryId = purchaseOrderVM.FactoryID;
            poStyle.SubContractRate = purchaseOrderVM.SubContractRate;
            poStyle.FactoryCM = purchaseOrderVM.FactoryCM;
            poStyle.SeasonId = purchaseOrderVM.SeasonID;
            poStyle.Destination = purchaseOrderVM.Destination;
            poStyle.ShipMode = purchaseOrderVM.ShipMode;
            poStyle.UnitID = purchaseOrderVM.UnitID;
            poStyle.CurrentStatus = purchaseOrderVM.CurrentStatus;
            poStyle.Remarks = purchaseOrderVM.Remarks;
            poStyle.Sam = purchaseOrderVM.Sam;

            unitOfWork.PurchaseOrderRepository.Update(poStyle);
            unitOfWork.Save();
        }

        public List<PurchaseOrderViewModel> GetAllPurchaseOrder(string poNo,int? purchaseOrderId = null, int? styleId = null, 
            int? factoryId = null, int? jobId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = (from p in unitOfWork.PurchaseOrderRepository.Get()
                         join s in unitOfWork.StyleRepository.Get() on p.StyleId equals s.StyleId
                         join b in unitOfWork.BuyerRepository.Get() on s.BuyerId equals b.BuyerId
                         join jb in unitOfWork.JobRepository.Get() on p.JobId equals jb.JobInfoId into g
                         join sn in unitOfWork.SeasonRepository.Get() on p.SeasonId equals sn.SeasonId
                         join f in unitOfWork.FactoryRepository.Get() on p.FactoryId equals f.FactoryId
                         from j in g.DefaultIfEmpty()
                         select new { p, s, j, b, f, sn }
                         ).AsQueryable();

            if (purchaseOrderId != null) 
                query = query.Where(x => x.p.PoStyleId == purchaseOrderId);

            if (styleId != null) 
                query = query.Where(x => x.s.StyleId == styleId);

            if (factoryId != null) 
                query = query.Where(x => x.p.FactoryId == factoryId);

            if(jobId != null) 
                query = query.Where(x => x.p.JobId == jobId);

            if (poNo != null)
                query = query.Where(x => x.p.PoNo == poNo);

            if (fromDate != null && toDate != null)
                query = query.Where(x=>x.p.ExitDate >= fromDate && x.p.ExitDate <= toDate);

            if (purchaseOrderId == null && styleId == null && factoryId == null && jobId == null && fromDate == null && toDate == null)
                query = query.Take(10);

            var result = (from x in query
                          orderby x.p.PoStyleId descending
                          select new PurchaseOrderViewModel
                          {
                              PurchaseOrderID = x.p.PoStyleId,

                              JobID = x.p.JobId,
                              JobNo = x.j.JobNo,

                              BuyerName = x.b.BuyerName,

                              StyleID = x.p.StyleId,
                              StyleNo = x.s.StyleNo,
                              StyleDescription= x.s.StyleDescription,
                              Febrication = x.s.Febrication,
                              HSCode= x.s.HSCode,

                              PurchaseOrderNo = x.p.PoNo,
                              MasterPO = x.p.MasterPO,
                              FOB = x.p.Fob,
                              AgreedCM = x.p.AgreedCm,
                              OrderQuantity = x.p.OrderQuantity,
                              ExitDate = x.p.ExitDate,
                              Destination = x.p.Destination,
                              ShipMode = x.p.ShipMode,
                              ShipModeName =
                               (
                                 x.p.ShipMode == 1 ? "Sea" :
                                 x.p.ShipMode == 2 ? "Air" :
                                 ""
                               ),
                              UnitID = x.p.UnitID,

                              FactoryID = x.p.FactoryId,
                              FactoryName = x.f.FactoryName,

                              SubContractRate = x.p.SubContractRate,
                              FactoryCM = x.p.FactoryCM,

                              SeasonID = x.p.SeasonId,
                              SeasonName = x.sn.SeasonName,

                              CurrentStatus = x.p.CurrentStatus,
                              Remarks = x.p.Remarks,
                              Sam = x.p.Sam ?? x.s.Sam,
                          }).Take(200).ToList();

            return result;
        }

        public PurchaseOrderViewModel GetPurchaseOrderByID(int id)
        {
            var result = (from s in unitOfWork.PurchaseOrderRepository.Get()
                          join ps in unitOfWork.StyleRepository.Get() on s.StyleId equals ps.StyleId
                          where s.PoStyleId == id
                          select new PurchaseOrderViewModel
                          {
                              PurchaseOrderID = s.PoStyleId,
                              JobID = s.JobId,
                              StyleID = s.StyleId,
                              PurchaseOrderNo = s.PoNo,
                              MasterPO = s.MasterPO,
                              FOB = s.Fob,
                              AgreedCM = s.AgreedCm,
                              OrderQuantity = s.OrderQuantity,
                              ExitDate = s.ExitDate,
                              Destination = s.Destination,
                              FactoryID = s.FactoryId,
                              SubContractRate = s.SubContractRate,
                              FactoryCM = s.FactoryCM,
                              SeasonID = s.SeasonId,
                              ShipMode = s.ShipMode,
                              UnitID = s.UnitID,
                              CurrentStatus = s.CurrentStatus,
                              Remarks = s.Remarks,
                              Sam = ps.Sam,
                          }).SingleOrDefault();

            return result;
        }
    }
}
