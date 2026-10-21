using ScopoERP.Core.Store.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using ScopoERP.Store.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Cryptography;

namespace ScopoERP.Store.BLL
{
    public class InventoryReceiveLogic
    {
        private UnitOfWork unitOfWork;

        public InventoryReceiveLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<InventoryInViewModel> Get(int pageIndex, int pageSize, int? blId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = (from r in unitOfWork.InventoryReceiveRepository.Get()
                         join b in unitOfWork.BLRepository.Get() on r.BLID equals b.BLID
                         join p in unitOfWork.PIRepository.Get() on r.PiID equals p.PIID
                         join sp in unitOfWork.SupplierRepository.Get() on p.SupplierID equals sp.SupplierId
                         orderby r.InventoryReceiveID descending
                         select new InventoryInViewModel
                         {
                             BLId = b.BLID,
                             BLNo = b.BLNo,
                             BLDate = b.BLDate,
                             InvoiceNo = b.InvoiceNo,
                             SupplierId = sp.SupplierId,
                             SupplierName = sp.SupplierName,
                             ReceivedBy = r.ReceivedBy,
                             ReceivedDate= r.ReceivedDate,
                             PiId = r.PiID,
                         }).AsQueryable();

            if (blId != null)
                query = query.Where(x => x.BLId == blId);

            if (fromDate != null && toDate != null)
            {
                query = query.Where(x => x.ReceivedDate >= fromDate);
                query = query.Where(x => x.ReceivedDate <= toDate);
            }

            return query.Distinct().OrderByDescending(x=>x.BLId).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        }

        public List<InventoryReceiveViewModel> GetById(int piId, int blId)
        {
            var stockData = GetCurrentStock(piId);

            var data = (from i in unitOfWork.InventoryReceiveRepository.Get()
                            join it in unitOfWork.ItemRepository.Get() on i.ItemID equals it.ItemId
                            join ic in unitOfWork.ItemCategoryRepository.Get() on it.ItemCategoryId equals ic.ItemCategoryId
                            join po in unitOfWork.PurchaseOrderRepository.Get() on i.PurchaseOrderID equals po.PoStyleId
                            join u in unitOfWork.ConsumptionUnitRepository.Get() on i.UnitID equals u.ConsumptionUnitId
                            where i.BLID == blId && i.PiID == piId
                            select new InventoryReceiveViewModel
                            {
                                ItemID = i.ItemID,
                                ItemName = it.ItemDescription,
                                ItemCategoryName = ic.Name,
                                ItemSize = i.ItemSize,
                                ItemColor = i.ItemColor,
                                UnitName = u.UnitName,
                                UnitID= i.UnitID,
                                PurchaseOrderID = i.PurchaseOrderID,
                                PONo = po.PoNo,
                                InvoiceQuantity = i.InvoiceQuantity,
                                ReceivedQuantity= i.ReceivedQuantity,
                            }).ToList();

            if (data == null || data.Count() == 0)
                        return stockData;

            var result = (from s in stockData
                          join d in data on new { s.ItemID, s.ItemSize, s.ItemColor, s.PurchaseOrderID } equals new { d.ItemID, d.ItemSize, d.ItemColor, d.PurchaseOrderID } into g
                          from blData in g.DefaultIfEmpty()
                          select new InventoryReceiveViewModel
                          {
                              ItemID = s.ItemID,
                              ItemName=s.ItemName,
                              ItemSize = s.ItemSize,
                              ItemColor = s.ItemColor,
                              UnitName = s.UnitName,
                              UnitID = s.UnitID,
                              PurchaseOrderID = s.PurchaseOrderID,
                              InvoiceQuantity = blData != null ? blData.InvoiceQuantity : 0,
                              ReceivedQuantity = blData != null ? blData.ReceivedQuantity : 0,
                              ItemCategoryName = s.ItemCategoryName,
                              PONo = s.PONo,
                              TotalIssued = s.TotalIssued,
                              TotalReceived = s.TotalReceived,
                              CurrentStock = s.CurrentStock,
                          }).ToList();

            return result;
        }

        public void Save(List<InventoryReceiveViewModel> VM,string user)
        {
            int blId = VM[0].BLID; int piId = VM[0].PiID;

            var info = (from i in unitOfWork.InventoryReceiveRepository.Get()
                        where i.BLID == blId && i.PiID == piId 
                        select i).ToList();

            if (info.Count > 0)
                unitOfWork.InventoryReceiveRepository.DeleteRange(info);

            foreach (var item in VM)
            {
                var InventoryReceive = new InventoryReceive
                {
                    PiID = item.PiID,
                    PurchaseOrderID = item.PurchaseOrderID,
                    UnitID = item.UnitID,
                    ItemID = item.ItemID,
                    ItemCode = item.ItemCode,
                    ItemSize = item.ItemSize,
                    ItemColor = item.ItemColor,
                    BLID = item.BLID,
                    InvoiceQuantity = item.InvoiceQuantity,
                    ReceivedQuantity = item.ReceivedQuantity ?? 0,
                    ReceivedBy = user,
                    ReceivedDate = item.ReceivedDate,
                    LastModifiedDate = DateTime.Now,
                    ModifiedBy = user

                };
                unitOfWork.InventoryReceiveRepository.Insert(InventoryReceive);
            }

            unitOfWork.Save();
        }

        private List<InventoryReceiveViewModel> GetCurrentStock(int piId)
        {
            var received = (from i in unitOfWork.InventoryReceiveRepository.Get()
                            join it in unitOfWork.ItemRepository.Get() on i.ItemID equals it.ItemId
                            group i by new { i.ItemID, i.ItemSize, i.ItemColor, PurchaseOrderID = i.PurchaseOrderID ?? default(int) } into g
                            select new
                            {

                                ItemID = g.Key.ItemID,
                                ItemSize = g.Key.ItemSize,
                                ItemColor = g.Key.ItemColor,
                                PurchaseOrderID= g.Key.PurchaseOrderID,
                                ReceivedQty = g.Sum(x => x.ReceivedQuantity)
                            });

            var issued = (from i in unitOfWork.InventoryIssueDetailsRepository.Get()
                          join it in unitOfWork.ItemRepository.Get() on i.ItemID equals it.ItemId
                          group i by new { ItemID = i.ItemID ?? default(int), i.ItemSize, i.ItemColor, i.PoStyleId } into g
                          select new
                          {
                              ItemID = g.Key.ItemID,
                              ItemSize = g.Key.ItemSize,
                              ItemColor = g.Key.ItemColor,
                              PurchaseOrderID = g.Key.PoStyleId,
                              IssuedQty = g.Sum(x => x.IssuedQuantity)
                          });

            var booking = (from b in unitOfWork.BookingRepository.Get()
                           where b.PIId == piId
                           group b by new { b.ItemID, b.ItemSize, b.ItemColor, b.PurchaseOrderID, b.PIId, b.ConsumptionUnitID } into g
                           select new
                           {
                               ItemID = g.Key.ItemID,
                               ItemSize = g.Key.ItemSize,
                               ItemColor = g.Key.ItemColor,
                               PurchaseOrderID = g.Key.PurchaseOrderID,
                               PIId = g.Key.PIId,
                               UnitID = g.Key.ConsumptionUnitID,
                               InvoiceQty = g.Sum(x => x.TotalQuantity)

                           });

            var result = (from b in booking
                         join r in received on new { b.ItemID, b.ItemSize, b.ItemColor, b.PurchaseOrderID } equals new { r.ItemID, r.ItemSize, r.ItemColor, r.PurchaseOrderID } into g
                         from re in g.DefaultIfEmpty()
                         join isu in issued on new { b.ItemID, b.ItemSize, b.ItemColor, b.PurchaseOrderID } equals new { isu.ItemID, isu.ItemSize, isu.ItemColor, isu.PurchaseOrderID } into ig
                         from isued in ig.DefaultIfEmpty()
                          join p in unitOfWork.PurchaseOrderRepository.Get() on b.PurchaseOrderID equals p.PoStyleId
                          join i in unitOfWork.ItemRepository.Get() on b.ItemID equals i.ItemId
                          join ic in unitOfWork.ItemCategoryRepository.Get() on i.ItemCategoryId equals ic.ItemCategoryId
                          join u in unitOfWork.ConsumptionUnitRepository.Get() on b.UnitID equals u.ConsumptionUnitId
                          select new InventoryReceiveViewModel
                         {
                             PiID = (int)b.PIId,
                             PurchaseOrderID = b.PurchaseOrderID,
                             PONo = p.PoNo,
                             ItemCategoryId = i.ItemCategoryId,
                             ItemCategoryName = ic.Name,
                             ItemID = b.ItemID,
                             ItemName = i.ItemDescription,
                             ItemSize = b.ItemSize,
                             ItemColor = b.ItemColor,
                             ItemDescription = i.ItemDescription,
                             UnitID = b.UnitID,
                             UnitName = u.UnitName,
                             InvoiceQuantity = b.InvoiceQty,
                             TotalReceived = re != null ? re.ReceivedQty : 0,
                             TotalIssued = isued != null ? isued.IssuedQty : 0,
                             CurrentStock = (re != null ? re.ReceivedQty : 0) - (isued != null ? isued.IssuedQty : 0),
                         }).ToList();


            return result;
        }

    }
}
