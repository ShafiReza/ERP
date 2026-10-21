using AutoMapper;
using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Core.Mapper;
using ScopoERP.Core.Store.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Store.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Store.Services
{
    public class InventoryIssueLogic
    {
        private UnitOfWork unitOfWork;
        private IMapper mapper;
        public InventoryIssueLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            mapper = MapperConfigure.Initialize();
        }

        public List<InventoryIssueViewModel> Get(int pageIndex, int pageSize, bool excelExport, DateTime? fromDate, DateTime? toDate, string SRNo, int? poId)
        {
            var query = (from i in unitOfWork.InventoryissueRepository.Get()
                         orderby i.InventoryIssueID descending
                         select new InventoryIssueViewModel
                         {
                             InventoryIssueID = i.InventoryIssueID,
                             IssuedDate = i.IssuedDate,
                             IssuedBy = i.IssuedBy,
                             ReceiverName = i.ReceiverName,
                             FloorLineID = i.FloorLineID,
                             SRNo = i.SRNo,
                             Status = i.Status

                         }).AsQueryable();
            if (fromDate != null && toDate != null)
                query = query.Where(x => x.IssuedDate >= fromDate && x.IssuedDate <= toDate);

            if (!String.IsNullOrEmpty(SRNo))
                query = query.Where(x => x.SRNo.Contains(SRNo));

            if (!excelExport)
                query = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            // search with details table data
            if(poId != null)
            {
                var inventoryIssueDetails = (from d in unitOfWork.InventoryIssueDetailsRepository.Get()
                                             where d.PoStyleId == poId
                                             select new InventoryIssueDetailsViewModel
                                             {
                                                 InventoryIssueID = d.InventoryIssueID,
                                                 InventoryIssueDetailsID = d.InventoryIssueDetailsID,
                                                 ItemColor = d.ItemColor,
                                                 PoStyleId = d.PoStyleId,
                                             }).ToList();

                var issueIds = inventoryIssueDetails.Select(detail => detail.InventoryIssueID).Distinct().ToList();

                 query = (from i in unitOfWork.InventoryissueRepository.Get()
                                      where issueIds.Contains(i.InventoryIssueID)
                                      orderby i.InventoryIssueID descending
                                      select new InventoryIssueViewModel
                                      {
                                          InventoryIssueID = i.InventoryIssueID,
                                          IssuedDate = i.IssuedDate,
                                          IssuedBy = i.IssuedBy,
                                          ReceiverName = i.ReceiverName,
                                          FloorLineID = i.FloorLineID,
                                          SRNo = i.SRNo,
                                          Status = i.Status
                                      });
            }

            return query.ToList();
        }

        public InventoryIssueViewModel GetByid(int id)
        {
            var inventoryIssue = (from i in unitOfWork.InventoryissueRepository.Get()
                               where i.InventoryIssueID == id
                               select new InventoryIssueViewModel
                               {
                                   InventoryIssueID = i.InventoryIssueID,
                                   IssuedDate = i.IssuedDate,
                                   IssuedBy = i.IssuedBy,
                                   ReceiverName = i.ReceiverName,
                                   FloorLineID = i.FloorLineID,
                                   SRNo = i.SRNo,
                                   Status = i.Status
                               }).SingleOrDefault();

            var inventoryIssueDetails = (from d in unitOfWork.InventoryIssueDetailsRepository.Get()
                                         join i in unitOfWork.ItemRepository.Get() on d.ItemID equals i.ItemId
                                         join p in unitOfWork.PurchaseOrderRepository.Get() on d.PoStyleId equals p.PoStyleId
                                         where d.InventoryIssueID == id
                                         select new InventoryIssueDetailsViewModel
                                         {
                                             InventoryIssueID = d.InventoryIssueID,
                                             InventoryIssueDetailsID = d.InventoryIssueDetailsID,
                                             IssuedQuantity = d.IssuedQuantity,
                                             ItemColor = d.ItemColor,
                                             ItemID = d.ItemID,
                                             ItemSize = d.ItemSize,
                                             ItemName = i.ItemDescription,
                                             PoStyleId = d.PoStyleId,
                                             PoNo = p.PoNo,
                                             RequestedQuantity = d.RequestedQuantity,
                                         }).ToList();

            inventoryIssue.Details = inventoryIssueDetails;


            return inventoryIssue;
        }

        public List<InventoryIssueDetailsViewModel> GetByPoItem(int poId, int itemId)
        {
            var stockData = GetCurrentStock(poId);

            var data = (from i in unitOfWork.InventoryIssueDetailsRepository.Get()
                        join it in unitOfWork.ItemRepository.Get() on i.ItemID equals it.ItemId
                        join ic in unitOfWork.ItemCategoryRepository.Get() on it.ItemCategoryId equals ic.ItemCategoryId
                        join po in unitOfWork.PurchaseOrderRepository.Get() on i.PoStyleId equals po.PoStyleId
                        where i.PoStyleId == poId && i.ItemID == itemId
                        group i by new {i.ItemID, i.ItemSize, i.ItemColor, i.PoStyleId} into g
                        select new InventoryIssueDetailsViewModel
                        {
                            ItemID = g.Key.ItemID,
                            ItemSize = g.Key.ItemSize,
                            ItemColor = g.Key.ItemColor,
                            PoStyleId = g.Key.PoStyleId,
                            IssuedQuantity = g.Sum(x=>x.IssuedQuantity),
                        }).ToList();

            if (data == null || data.Count() == 0)
                return stockData.Where(x=>x.ItemID == itemId).ToList();

            var result = (from s in stockData
                          join d in data on new { s.ItemID, s.ItemSize, s.ItemColor, s.PoStyleId } equals new { d.ItemID, d.ItemSize, d.ItemColor, d.PoStyleId } into g
                          from isuData in g.DefaultIfEmpty()
                          where s.ItemID == itemId
                          select new InventoryIssueDetailsViewModel
                          {
                              ItemID = s.ItemID,
                              ItemName = s.ItemName,
                              ItemSize = s.ItemSize,
                              ItemColor = s.ItemColor,
                              UnitName = s.UnitName,
                              UnitID = s.UnitID,
                              PoStyleId = s.PoStyleId,
                              ReceivedQuantity = s.ReceivedQuantity,
                              ItemCategoryName = s.ItemCategoryName,
                              PoNo = s.PoNo,
                              TotalIssued = s.TotalIssued,
                              TotalReceived = s.TotalReceived,
                              StockQuantity = s.StockQuantity,
                          }).ToList();

            return result;
        }

        public void Save(InventoryIssueViewModel IssueVM, string user)
        {

            InventoryIssue inventoryissue = new InventoryIssue
            {
                IssuedDate = IssueVM.IssuedDate,
                IssuedBy = IssueVM.IssuedBy,
                ReceiverName = IssueVM.ReceiverName,
                CreatedBy = IssueVM.CreatedBy,
                CreatedDate = DateTime.Now,
                FloorLineID = IssueVM.FloorLineID,
                Remarks = IssueVM.Remarks,
                Status = 1,
                ModifiedBy = IssueVM.ModifiedBy,
                LastModifiedDate = DateTime.Now,
                SRNo = IssueVM.SRNo
            };

            if (IssueVM.Details.Count > 0)
            {
                foreach (var detail in IssueVM.Details)
                {
                    inventoryissue.InventoryIssueDetails.Add(new InventoryIssueDetails
                    {
                        PoStyleId = detail.PoStyleId,
                        IssuedQuantity = detail.IssuedQuantity,
                        ItemID = detail.ItemID,
                        RequestedQuantity = detail.RequestedQuantity,
                        ItemColor = detail.ItemColor,
                        ItemSize = detail.ItemSize,
                        Status = 1,
                        ModifiedBy = IssueVM.ModifiedBy,
                        LastModifiedDate = DateTime.Now

                    });

                }
            }
            unitOfWork.InventoryissueRepository.Insert(inventoryissue);
            unitOfWork.Save();

        }

        public void Update(InventoryIssueViewModel IssueVM)
        {
            var existingIssueDetails = unitOfWork.InventoryIssueDetailsRepository.Get().Where(x => x.InventoryIssueID == IssueVM.InventoryIssueID).ToList();
            unitOfWork.InventoryIssueDetailsRepository.DeleteRange(existingIssueDetails);

            var existingIssue = unitOfWork.InventoryissueRepository.Get().Where(x=>x.InventoryIssueID== IssueVM.InventoryIssueID).SingleOrDefault();

            existingIssue.IssuedDate = IssueVM.IssuedDate;
            existingIssue.IssuedBy = IssueVM.IssuedBy;
            existingIssue.ReceiverName = IssueVM.ReceiverName;
            existingIssue.CreatedBy = IssueVM.CreatedBy;
            existingIssue.CreatedDate = DateTime.Now;
            existingIssue.FloorLineID = IssueVM.FloorLineID;
            existingIssue.Remarks = IssueVM.Remarks;
            existingIssue.Status = 1;
            existingIssue.ModifiedBy = IssueVM.ModifiedBy;
            existingIssue.LastModifiedDate = DateTime.Now;
            existingIssue.SRNo = IssueVM.SRNo;
            

            if (IssueVM.Details.Count > 0)
            {
                foreach (var detail in IssueVM.Details)
                {
                    existingIssue.InventoryIssueDetails.Add(new InventoryIssueDetails
                    {
                        PoStyleId = detail.PoStyleId,
                        IssuedQuantity = detail.IssuedQuantity,
                        ItemID = detail.ItemID,
                        RequestedQuantity = detail.RequestedQuantity,
                        ItemColor = detail.ItemColor,
                        ItemSize = detail.ItemSize,
                        Status = 1,
                        ModifiedBy = IssueVM.ModifiedBy,
                        LastModifiedDate = DateTime.Now

                    });

                }
            }
            unitOfWork.InventoryissueRepository.Update(existingIssue);
            unitOfWork.Save();
        }

        private List<InventoryIssueDetailsViewModel> GetCurrentStock(int poId)
        {
            var received = (from i in unitOfWork.InventoryReceiveRepository.Get()
                            join it in unitOfWork.ItemRepository.Get() on i.ItemID equals it.ItemId
                            where i.PurchaseOrderID == poId
                            group i by new { i.ItemID, i.ItemSize, i.ItemColor, PurchaseOrderID = i.PurchaseOrderID ?? default(int) } into g
                            select new
                            {
                                ItemID = g.Key.ItemID,
                                ItemSize = g.Key.ItemSize,
                                ItemColor = g.Key.ItemColor,
                                PurchaseOrderID = g.Key.PurchaseOrderID,
                                ReceivedQty = g.Sum(x => x.ReceivedQuantity)
                            }).ToList();

            var issued = (from i in unitOfWork.InventoryIssueDetailsRepository.Get()
                          join it in unitOfWork.ItemRepository.Get() on i.ItemID equals it.ItemId
                          where i.PoStyleId == poId
                          group i by new { ItemID = i.ItemID ?? default(int), i.ItemSize, i.ItemColor, i.PoStyleId } into g
                          select new
                          {
                              ItemID = g.Key.ItemID,
                              ItemSize = g.Key.ItemSize,
                              ItemColor = g.Key.ItemColor,
                              PurchaseOrderID = g.Key.PoStyleId,
                              IssuedQty = g.Sum(x => x.IssuedQuantity)
                          }).ToList();

            var booking = (from b in unitOfWork.BookingRepository.Get()
                           where b.PurchaseOrderID == poId
                           group b by new { b.ItemID, b.ItemSize, b.ItemColor, b.PurchaseOrderID, b.ConsumptionUnitID } into g
                           select new
                           {
                               ItemID = g.Key.ItemID,
                               ItemSize = g.Key.ItemSize,
                               ItemColor = g.Key.ItemColor,
                               PurchaseOrderID = g.Key.PurchaseOrderID,
                               UnitID = g.Key.ConsumptionUnitID,
                               InvoiceQty = g.Sum(x => x.TotalQuantity)
                           }).ToList();

            var result = (from b in booking
                          join r in received on new { b.ItemID, b.ItemSize, b.ItemColor, b.PurchaseOrderID } equals new { r.ItemID, r.ItemSize, r.ItemColor, r.PurchaseOrderID } into rg
                          from re in rg.DefaultIfEmpty()
                          join isu in issued on new { b.ItemID, b.ItemSize, b.ItemColor, b.PurchaseOrderID } equals new { isu.ItemID, isu.ItemSize, isu.ItemColor, isu.PurchaseOrderID } into ig
                          from isued in ig.DefaultIfEmpty()
                          join p in unitOfWork.PurchaseOrderRepository.Get() on b.PurchaseOrderID equals p.PoStyleId
                          join i in unitOfWork.ItemRepository.Get() on b.ItemID equals i.ItemId
                          join ic in unitOfWork.ItemCategoryRepository.Get() on i.ItemCategoryId equals ic.ItemCategoryId
                          join u in unitOfWork.ConsumptionUnitRepository.Get() on b.UnitID equals u.ConsumptionUnitId
                          select new InventoryIssueDetailsViewModel
                          {
                              PoStyleId = b.PurchaseOrderID,
                              PoNo = p.PoNo,
                              ItemCategoryId = i.ItemCategoryId,
                              ItemCategoryName = ic.Name,
                              ItemID = b.ItemID,
                              ItemName = i.ItemDescription,
                              ItemSize = b.ItemSize,
                              ItemColor = b.ItemColor,
                              UnitID = b.UnitID,
                              UnitName = u.UnitName,
                              TotalReceived = re != null ? re.ReceivedQty : 0,
                              TotalIssued = isued != null ? isued.IssuedQty : 0,
                              StockQuantity = (re != null ? re.ReceivedQty : 0) - (isued != null ? isued.IssuedQty : 0),
                          }).ToList();


            return result;
        }

    }
}
