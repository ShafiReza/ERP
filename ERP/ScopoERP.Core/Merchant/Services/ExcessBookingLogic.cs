using ScopoERP.Core.Merchant.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Merchant.Services
{
    public class ExcessBookingLogic
    {
        private UnitOfWork unitOfWork;

        public ExcessBookingLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public List<ExcessBookingViewModel> GetAllExcessBookings(int pageIndex, int pageSize, int? piId, int? jobId)
        {
            var result = (from e in unitOfWork.ExcessBookingRepository.Get()
                          join i in unitOfWork.ItemRepository.Get() on e.ItemID equals i.ItemId
                          join p in unitOfWork.PIRepository.Get() on e.ProformaInvoiceID equals p.PIID
                          join j in unitOfWork.JobRepository.Get() on e.JobID equals j.JobInfoId
                          select new ExcessBookingViewModel
                          {
                              ItemID = e.ItemID,
                              ItemName = i.ItemDescription,
                              ExcessBookingID = e.ExcessBookingID,
                              JobID = e.JobID,
                              JobNo = j.JobNo,
                              ProformaInvoiceID = e.ProformaInvoiceID,
                              PINo = String.IsNullOrEmpty(p.PINo) ? p.ReferenceNo : p.PINo,
                              ItemColor = e.ItemColor,
                              ItemSize = e.ItemSize,
                              TotalQuantity = e.TotalQuantity,
                              TotalPrice = e.TotalPrice,
                          }).AsQueryable();
            if(piId != null)
                result = result.Where(x=>x.ProformaInvoiceID == piId);
            if(jobId != null)
                result = result.Where(x=>x.JobID == jobId);

            return result.OrderByDescending(x => x.ExcessBookingID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        }

        public void SaveExcessBooking(ExcessBookingViewModel viewModel)
        {
            var excessbooking = new excessbooking
            {
                ItemID = viewModel.ItemID,
                JobID = viewModel.JobID,
                ProformaInvoiceID = viewModel.ProformaInvoiceID,
                ItemColor = viewModel.ItemColor,
                ItemSize = viewModel.ItemSize,
                TotalQuantity = viewModel.TotalQuantity,
                TotalPrice = viewModel.TotalPrice,
            };
            unitOfWork.ExcessBookingRepository.Insert(excessbooking);
            unitOfWork.Save();
        }

        public void UpdateExcessBooking(ExcessBookingViewModel viewModel)
        {
            var existExcessbooking = unitOfWork.ExcessBookingRepository.Get().Where(x=>x.ExcessBookingID == viewModel.ExcessBookingID).SingleOrDefault();

            if(existExcessbooking != null)
            {
                existExcessbooking.ExcessBookingID = viewModel.ExcessBookingID;
                existExcessbooking.ItemID = viewModel.ItemID;
                existExcessbooking.JobID = viewModel.JobID;
                existExcessbooking.ProformaInvoiceID = viewModel.ProformaInvoiceID;
                existExcessbooking.ItemColor = viewModel.ItemColor;
                existExcessbooking.ItemSize = viewModel.ItemSize;
                existExcessbooking.TotalQuantity = viewModel.TotalQuantity;
                existExcessbooking.TotalPrice = viewModel.TotalPrice;

                unitOfWork.ExcessBookingRepository.Update(existExcessbooking);
                unitOfWork.Save();
            }

            
        }
    }
}
