using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;

namespace ScopoERP.MaterialManagement.BLL
{
    public class BookingLogic
    {
        private UnitOfWork unitOfWork;

        public BookingLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<PIViewModel> GetBookings(int? piId = null, int? supplierId = null)
        {
            var query = (from p in unitOfWork.PIRepository.Get()
                         join s in unitOfWork.SupplierRepository.Get() on p.SupplierID equals s.SupplierId
                         join rq in unitOfWork.RequisitionRepository.Get() on p.RequisitionID equals rq.RequisitionID into rg
                         from r in rg.DefaultIfEmpty()
                         join bc in unitOfWork.BackToBackLCRepository.Get() on p.BackToBackLCID equals bc.BackToBackLCID into bg
                         from b in bg.DefaultIfEmpty()
                         orderby p.ReferenceNo descending
                         select new { p, s, r, b }).AsQueryable();

            if (piId != null)
                query = query.Where(x => x.p.PIID == piId);

            if(supplierId != null)
                query = query.Where(x=>x.p.SupplierID == supplierId);

            if (piId == null && supplierId == null)
                query = query.Take(10);

            var data = (from x in query
                        select new PIViewModel
                        {
                            PIID = x.p.PIID,
                            PINo = x.p.PINo,
                            PIDate = x.p.PIDate,
                            ReferenceNo = x.p.ReferenceNo,

                            SupplierID = x.p.SupplierID,
                            SupplierName = x.s.SupplierName,

                            BackToBackLCID = x.p.BackToBackLCID,
                            BackToBackLCNo = x.b.BackToBackLC1,

                            RequisitionID = x.p.RequisitionID,
                            RequisitionNo = x.r.RequisitionNo,

                            JobID = x.p.JobID,
                            LoanFromJobID = x.p.LoanFromJobID,
                                                        
                            OrderRefNo = x.p.OrderRefNo,
                            OrderDate = x.p.OrderDate,
                            ApproximateInhouseDate = x.p.ApproximateInhouseDate,
                        }).ToList();

            return data;
        }

        public List<BookingViewModel> GetBookingDetails(int piId)
        {
            var data = (from b in unitOfWork.BookingRepository.Get()
                        join i in unitOfWork.ItemRepository.Get() on b.ItemID equals i.ItemId
                        join ic in unitOfWork.ItemCategoryRepository.Get() on i.ItemCategoryId equals ic.ItemCategoryId
                        join u in unitOfWork.ConsumptionUnitRepository.Get() on b.ConsumptionUnitID equals u.ConsumptionUnitId
                        join p in unitOfWork.PurchaseOrderRepository.Get() on b.PurchaseOrderID equals p.PoStyleId
                        join s in unitOfWork.StyleRepository.Get() on p.StyleId equals s.StyleId
                        where b.PIId == piId
                        select new BookingViewModel
                        {
                            BookingID = b.BookingID,
                            PIId = b.PIId,
                            PurchaseOrderID = b.PurchaseOrderID,
                            PONo = p.PoNo,
                            StyleNo= s.StyleNo,
                            
                            ItemID = b.ItemID,
                            ItemDescription = i.ItemDescription,
                            ItemSize = b.ItemSize,
                            ItemColor = b.ItemColor,
                            ItemCode= i.ItemCode,
                            ItemCategoryName = ic.Name,

                            TotalQuantity = b.TotalQuantity,
                            UnitID = b.ConsumptionUnitID,
                            UnitName = u.UnitName,
                            UnitPrice = b.UnitPrice,
                            TotalPrice = b.TotalQuantity * b.UnitPrice
                        }).ToList();

            return data;
        }

        public string GetNewReferenceNo()
        {
            string newReferenceNo = string.Empty;

            var result = (from c in unitOfWork.PIRepository.Get()
                          orderby c.PIID descending
                          select c.ReferenceNo).FirstOrDefault();

            if (result == null)
                newReferenceNo = "REF-" + DateTime.Now.Year.ToString() + "-00001";
            else
            {
                string newReferenceNoInDigit = (Convert.ToInt32(result.Split('-').Last()) + 1).ToString().PadLeft(5, '0');

                newReferenceNo = "REF-" + DateTime.Now.Year.ToString() + "-" + newReferenceNoInDigit;
            }

            return newReferenceNo;
        }

        public void SaveBooking(BookingEntryViewModel viewModel)
        {
            var pi = new piinfo
            {
                PIID = viewModel.PI.PIID,
                ReferenceNo = viewModel.PI.ReferenceNo,
                PINo = viewModel.PI.PINo,
                PIDate = viewModel.PI.PIDate,
                SupplierID = viewModel.PI.SupplierID,
                JobID = viewModel.PI.JobID,
                LoanFromJobID = viewModel.PI.LoanFromJobID,
                BackToBackLCID = viewModel.PI.BackToBackLCID,
                RequisitionID = viewModel.PI.RequisitionID,

                ApproximateInhouseDate = viewModel.PI.ApproximateInhouseDate,
                OrderRefNo = viewModel.PI.OrderRefNo,
                OrderDate = viewModel.PI.OrderDate,

                ModifiedBy = viewModel.PI.ModifiedBy,
                LastModifiedDate = DateTime.Now,
            };

            if (viewModel.PI.PIID == 0)
            {
                pi.ReferenceNo = GetNewReferenceNo();
                unitOfWork.PIRepository.Insert(pi);
            }
            else
            {
                unitOfWork.PIRepository.Update(pi);

                var bookings = unitOfWork.BookingRepository.Get().Where(x => x.PIId == viewModel.PI.PIID).ToList();
                unitOfWork.BookingRepository.DeleteRange(bookings);
            }

            foreach(var item in viewModel.Bookings)
            {
                var booking = new booking
                {
                    BookingID = item.BookingID,
                    PIId = pi.PIID,
                    PurchaseOrderID = item.PurchaseOrderID,

                    ItemID = item.ItemID,
                    ItemSize = item.ItemSize,
                    ItemColor = item.ItemColor,

                    TotalQuantity = item.TotalQuantity,
                    ConsumptionUnitID = item.UnitID,
                    UnitPrice = item.UnitPrice,

                    RevisionNo = item.RevisionNo,
                    ModifiedBy = viewModel.PI.ModifiedBy,
                    LastModifiedDate = DateTime.Now,

                    UserID = 0, // remove later
                    SetDate = DateTime.Now, // remove later
                };

                unitOfWork.BookingRepository.Insert(booking);
            }
            unitOfWork.Save();
        }

        public void DeleteBooking(int piId)
        {
            var bookings = unitOfWork.BookingRepository.Get().Where(x => x.PIId == piId).ToList();
            unitOfWork.BookingRepository.DeleteRange(bookings);

            var pi = unitOfWork.PIRepository.GetById(piId);
            unitOfWork.PIRepository.Delete(pi);

            unitOfWork.Save();
        }
    }
}
