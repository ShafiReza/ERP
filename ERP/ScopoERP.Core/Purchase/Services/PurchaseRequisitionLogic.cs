using ScopoERP.Commercial.ViewModel;
using ScopoERP.Core.Purchase.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using ScopoERP.Store.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Data.Entity.Infrastructure.Design.Executor;

namespace ScopoERP.Core.Purchase
{
    public class PurchaseRequisitionLogic
    {
        private UnitOfWork unitOfWork;

        public PurchaseRequisitionLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<PurchaseRequisitionViewModel> GetAllRequisition(int pageIndex, int pageSize, bool excelExport, int? requisitionId, DateTime? fromDate, DateTime? toDate)
        {
            var result = from c in unitOfWork.PurchaseRequisitionRepository.Get()
                         join co in unitOfWork.CompanyRepository.Get() on c.CompanyId equals co.CompanyID into g
                         from co in g.DefaultIfEmpty()
                         select new PurchaseRequisitionViewModel
                         {
                            PurchaseRequisitionID = c.PurchaseRequisitionID,
                            RequisitionNo = c.RequisitionNo,
                             RequisitionDate = c.RequisitionDate,
                             Remarks = c.Remarks,
                             CompanyId = c.CompanyId,
                             Company = co.CompanyName,
                             DepartmentID = c.DepartmentID,
                             Status = c.Status,
                         };

            if(requisitionId != null)
                result = result.Where(x=>x.PurchaseRequisitionID== requisitionId);

            if (fromDate != null && toDate != null)
                result = result.Where(x => x.RequisitionDate >= fromDate && x.RequisitionDate <= toDate);

            if (!excelExport)
                return result.OrderByDescending(o => o.PurchaseRequisitionID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            return result.OrderByDescending(x=>x.PurchaseRequisitionID).ToList();
        }

        public PurchaseRequisitionViewModel GetRequisitionByID(int requisitionID)
        {
            var result = (from c in unitOfWork.PurchaseRequisitionRepository.Get()
                          join d in unitOfWork.DepartmentRepository.Get() on c.DepartmentID equals d.DepartmentID
                          join co in unitOfWork.CompanyRepository.Get() on c.CompanyId equals co.CompanyID into cg
                          from co in cg.DefaultIfEmpty()
                          where c.PurchaseRequisitionID == requisitionID
                          select new PurchaseRequisitionViewModel
                          {
                              PurchaseRequisitionID = c.PurchaseRequisitionID,
                              RequisitionNo = c.RequisitionNo,
                              RequisitionDate = c.RequisitionDate,
                              Remarks = c.Remarks,
                              CompanyId = c.CompanyId,
                              Company = co != null ? co.CompanyName : "",
                              DepartmentID = c.DepartmentID,
                              DepartmentName = d.DepartmentName,
                              Status = c.Status
                          }).SingleOrDefault();

            var requisitionDetails = (from p in unitOfWork.PurchaseRequisitionDetailsRepository.Get()
                                      join i in unitOfWork.ItemRepository.Get() on p.ItemID equals i.ItemId
                                      join u in unitOfWork.ConsumptionUnitRepository.Get() on p.UnitID equals u.ConsumptionUnitId
                                      where p.PurchaseRequisitionID == requisitionID
                                      select new PurchaseRequisitionDetailsViewModel
                                      {
                                          PurchaseRequisitionDetailsID = p.PurchaseRequisitionDetailsID,
                                          PurchaseRequisitionID = p.PurchaseRequisitionID,
                                          ItemID = p.ItemID,
                                          ItemName = i.ItemDescription,
                                          UnitID= p.UnitID,
                                          UnitName = u.UnitName,
                                          UnitPrice= p.UnitPrice,
                                          ProductDescription= p.ProductDescription,
                                          Quantity= p.Quantity,
                                      }).ToList();


            result.PurchaseRequisitionDetails = requisitionDetails;

            return result;
        }

        public string CreateRequisition(PurchaseRequisitionViewModel requisitionVM)
        {
           var requisition = new PurchaseRequisition
            {
               RequisitionNo = GetNewReferenceNo(),
               RequisitionDate = requisitionVM.RequisitionDate,
               Remarks = requisitionVM.Remarks,
               CompanyId = requisitionVM.CompanyId,
               DepartmentID = requisitionVM.DepartmentID,
               Status = requisitionVM.Status,
               UserID = requisitionVM.UserID,
               SetDate = DateTime.Now
           };



            if (requisitionVM.PurchaseRequisitionDetails != null)
            {
                foreach (var detail in requisitionVM.PurchaseRequisitionDetails)
                {
                    requisition.PurchaseRequisitionDetails.Add(new PurchaseRequisitionDetail
                    {
                        ItemID = detail.ItemID,
                        UnitID = detail.UnitID,
                        UnitPrice = detail.UnitPrice,
                        ProductDescription = detail.ProductDescription,
                        Quantity = detail.Quantity,

                    });

                }
            }

            unitOfWork.PurchaseRequisitionRepository.Insert(requisition);
            unitOfWork.Save();

            return requisition.RequisitionNo;
        }

        public void UpdateRequisition(PurchaseRequisitionViewModel requisitionVM)
        {
            var existingRequisitionDetails = unitOfWork.PurchaseRequisitionDetailsRepository.Get().Where(x => x.PurchaseRequisitionID == requisitionVM.PurchaseRequisitionID).ToList();
            unitOfWork.PurchaseRequisitionDetailsRepository.DeleteRange(existingRequisitionDetails);

            var existingRequisition = unitOfWork.PurchaseRequisitionRepository.Get().Where(x => x.PurchaseRequisitionID == requisitionVM.PurchaseRequisitionID).SingleOrDefault();

            existingRequisition.RequisitionNo = requisitionVM.RequisitionNo;
            existingRequisition.RequisitionDate = requisitionVM.RequisitionDate;
            existingRequisition.Remarks = requisitionVM.Remarks;
            existingRequisition.CompanyId = requisitionVM.CompanyId;
            existingRequisition.DepartmentID = requisitionVM.DepartmentID;
            existingRequisition.Status = requisitionVM.Status;
            existingRequisition.UserID = requisitionVM.UserID;
            existingRequisition.SetDate = DateTime.Now;


            if (requisitionVM.PurchaseRequisitionDetails.Count > 0)
            {
                foreach (var detail in requisitionVM.PurchaseRequisitionDetails)
                {
                    existingRequisition.PurchaseRequisitionDetails.Add(new PurchaseRequisitionDetail
                    {
                        ItemID = detail.ItemID,
                        UnitID = detail.UnitID,
                        UnitPrice = detail.UnitPrice,
                        ProductDescription = detail.ProductDescription,
                        Quantity = detail.Quantity,

                    });

                }
            }
            unitOfWork.PurchaseRequisitionRepository.Update(existingRequisition);
            unitOfWork.Save();
        }

        public string GetNewReferenceNo()
        {
            string newRequisitionNo = string.Empty;

            var result = (from c in unitOfWork.PurchaseRequisitionRepository.Get()
                          orderby c.PurchaseRequisitionID descending
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
    }
}
