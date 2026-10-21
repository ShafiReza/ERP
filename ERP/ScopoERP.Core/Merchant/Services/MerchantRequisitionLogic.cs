using ScopoERP.Commercial.ViewModel;
using ScopoERP.Core.Merchant.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Merchant.Services
{
    public class MerchantRequisitionLogic
    {
        private UnitOfWork unitOfWork;
        private requisition requisition;
        private piinfo piInfo;

        public MerchantRequisitionLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<RequisitionViewModel> GetAllRequisition(int pageIndex, int pageSize, bool excelExport, int? jobId)
        {
            var result = from c in unitOfWork.RequisitionRepository.Get()
                         join j in unitOfWork.JobRepository.Get()
                         on c.JobID equals j.JobInfoId
                         select new RequisitionViewModel
                         {
                             RequisitionID = c.RequisitionID,
                             RequisitionNo = c.RequisitionNo,
                             RequisitionSerial = c.RequisitionSerial,
                             RequisitionDate = c.RequisitionDate,
                             JobID = c.JobID,
                             JobNo = j.JobNo,
                             AccountID = c.AccountID,
                             UserID = c.UserID
                         };
            if (jobId != null)
                result = result.Where(x => x.JobID == jobId);

            if (!excelExport)
                return result.OrderByDescending(o => o.RequisitionID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            return result.ToList();
        }

        public RequisitionViewModel GetRequisitionByID(int requisitionID)
        {
            var result = (from c in unitOfWork.RequisitionRepository.Get()
                          where c.RequisitionID == requisitionID
                          select new RequisitionViewModel
                          {
                              RequisitionID = c.RequisitionID,
                              RequisitionNo = c.RequisitionNo,
                              RequisitionSerial = c.RequisitionSerial,
                              RequisitionDate = c.RequisitionDate,
                              JobID = c.JobID,
                              AccountID = c.AccountID,
                              UserID = c.UserID,
                              SetupDate = c.SetupDate
                          }).SingleOrDefault();

            var piList = (from p in unitOfWork.PIRepository.Get()
                          join b in unitOfWork.BookingRepository.Get() on p.PIID equals b.PIId
                          where p.RequisitionID == requisitionID
                          group b by new { p.PIID, p.PINo } into s
                          select new PISummary
                          {
                              PIID = s.Key.PIID,
                              PINo = s.Key.PINo,
                              PIValue = s.Sum(x => x.TotalQuantity * x.UnitPrice)
                          }).ToList();

            var piListFromExcessBooking = (from p in unitOfWork.PIRepository.Get()
                                           join b in unitOfWork.ExcessBookingRepository.Get()
                                           on p.PIID equals b.ProformaInvoiceID
                                           where p.RequisitionID == requisitionID
                                           group b by new { p.PIID, p.PINo } into s
                                           select new PISummary
                                           {
                                               PIID = s.Key.PIID,
                                               PINo = s.Key.PINo,
                                               PIValue = s.Sum(x => x.TotalPrice)
                                           }).ToList();

            piList.AddRange(piListFromExcessBooking);

            result.PIList = piList;

            return result;
        }

        public requisition CreateRequisition(RequisitionViewModel requisitionVM)
        {
            this.requisition = new requisition()
            {
                RequisitionNo = GetNewReferenceNo(),
                RequisitionSerial = GetRequisitionSerial(requisitionVM.JobID),
                RequisitionDate = requisitionVM.RequisitionDate,
                JobID = requisitionVM.JobID,
                AccountID = 1,
                Status = true,
                UserID = requisitionVM.UserID,
                SetupDate = DateTime.Now,
                SupplierID = requisitionVM.SupplierID
            };

            unitOfWork.RequisitionRepository.Insert(requisition);
            unitOfWork.Save();

            if (requisitionVM.PIList != null)
            {
                foreach (var item in requisitionVM.PIList)
                {
                    piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                    piInfo.RequisitionID = requisition.RequisitionID;

                    unitOfWork.PIRepository.Update(piInfo);
                }
            }

            unitOfWork.Save();

            return requisition;
        }

        public string UpdateRequisition(RequisitionViewModel requisitionVM)
        {
            this.requisition = new requisition()
            {
                RequisitionID = requisitionVM.RequisitionID,
                RequisitionNo = requisitionVM.RequisitionNo,
                RequisitionSerial = requisitionVM.RequisitionSerial,
                RequisitionDate = requisitionVM.RequisitionDate,
                JobID = requisitionVM.JobID,
                AccountID = 1,
                Status = true,
                UserID = requisitionVM.UserID,
                SetupDate = DateTime.Now,
                SupplierID = requisitionVM.SupplierID
            };
            unitOfWork.RequisitionRepository.Update(requisition);

            var piList = (from s in unitOfWork.PIRepository.Get()
                          where s.RequisitionID == requisitionVM.RequisitionID
                          select s).ToList();

            foreach (var item in piList)
            {
                piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                piInfo.RequisitionID = null;
                unitOfWork.PIRepository.Update(piInfo);
            }

            if (requisitionVM.PIList != null)
            {
                foreach (var item in requisitionVM.PIList)
                {
                    piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                    piInfo.RequisitionID = requisitionVM.RequisitionID;
                    unitOfWork.PIRepository.Update(piInfo);
                }
            }

            unitOfWork.Save();

            return requisition.RequisitionNo;
        }

        public string GetNewReferenceNo()
        {
            string newRequisitionNo = string.Empty;

            var result = (from c in unitOfWork.RequisitionRepository.Get()
                          orderby c.RequisitionID descending
                          select c.RequisitionNo).FirstOrDefault();

            if (result == null)
            {
                newRequisitionNo = "REQ-" + DateTime.Now.Year.ToString() + "-00001";
            }
            else
            {
                string newRequisitionNoInDigit = (Convert.ToInt32(result.Split('-').Last()) + 1).ToString().PadLeft(5, '0');

                newRequisitionNo = "REQ-" + DateTime.Now.Year.ToString() + "-" + newRequisitionNoInDigit;
            }
            return newRequisitionNo;
        }

        public int GetRequisitionSerial(int jobId)
        {
       
            var query = unitOfWork.RequisitionRepository.Get().Where(x=>x.JobID== jobId).ToList();
            return query.Count()+1;
        }
    }
}
