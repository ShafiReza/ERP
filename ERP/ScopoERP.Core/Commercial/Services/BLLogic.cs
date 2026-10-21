using ScopoERP.Commercial.ViewModel;
using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace ScopoERP.Commercial.BLL
{
    public class BLLogic
    {
        private UnitOfWork unitOfWork;
        private bl bl;

        public BLLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public int CreateBL(BLViewModel blVM)
        {
            this.bl = new bl()
            {
                BLNo = blVM.BLNo,
                BLDate = blVM.BLDate,
                InvoiceNo = blVM.InvoiceNo,
                InvoiceDate = blVM.InvoiceDate,
                CopyDocumentReceivedDate = blVM.CopyDocumentReceivedDate,
                OriginalDocumentReceivedDate = blVM.OriginalDocumentReceivedDate,
                DocumentSentToCNF = blVM.DocumentSentToCNF,
                GoodsDeliveryDateByCNF = blVM.GoodsDeliveryDateByCNF,
                GoodsInHouseDate = blVM.GoodsInHouseDate,
                AcceptanceValue = blVM.AcceptanceValue,
                AcceptanceDate = blVM.AcceptanceDate,
                BackToBackLCID = blVM.BackToBackLCID,
                MaturityDate = blVM.MaturityDate,
                Port = blVM.Port,
                BillEntryNo = blVM.BillEntryNo,
                BillEntryDate = blVM.BillEntryDate,
                BillEntryDsc = blVM.BillEntryDsc,
                IsChalan = false,
                Status = blVM.Status,
                PassBookNo = blVM.PassBookNo
            };

            unitOfWork.BLRepository.Insert(bl);
            unitOfWork.Save();

            return bl.BLID;
        }

        public void UpdateBL(BLViewModel blVM)
        {
            this.bl = new bl()
            {
                BLID = blVM.BLID,
                BLNo = blVM.BLNo,
                BLDate = blVM.BLDate,
                InvoiceNo = blVM.InvoiceNo,
                InvoiceDate = blVM.InvoiceDate,
                CopyDocumentReceivedDate = blVM.CopyDocumentReceivedDate,
                OriginalDocumentReceivedDate = blVM.OriginalDocumentReceivedDate,
                DocumentSentToCNF = blVM.DocumentSentToCNF,
                GoodsDeliveryDateByCNF = blVM.GoodsDeliveryDateByCNF,
                GoodsInHouseDate = blVM.GoodsInHouseDate,
                AcceptanceValue = blVM.AcceptanceValue,
                AcceptanceDate = blVM.AcceptanceDate,
                BackToBackLCID = blVM.BackToBackLCID,
                MaturityDate = blVM.MaturityDate,
                Port = blVM.Port,
                BillEntryNo = blVM.BillEntryNo,
                BillEntryDate = blVM.BillEntryDate,
                BillEntryDsc = blVM.BillEntryDsc,
                IsChalan = blVM.IsChalan,
                Status = blVM.Status,
                PassBookNo = blVM.PassBookNo
            };

            unitOfWork.BLRepository.Update(bl);
            unitOfWork.Save();
        }

        public BLViewModel GetBLByID(int id)
        {
            var result = (from c in unitOfWork.BLRepository.Get()
                          join b in unitOfWork.BackToBackLCRepository.Get() on c.BackToBackLCID equals b.BackToBackLCID
                          where c.BLID == id
                          select new BLViewModel
                          {
                              BLID = c.BLID,
                              BLNo = c.BLNo,
                              BLDate = c.BLDate,
                              InvoiceNo = c.InvoiceNo,
                              InvoiceDate = c.InvoiceDate,
                              CopyDocumentReceivedDate = c.CopyDocumentReceivedDate,
                              OriginalDocumentReceivedDate = c.OriginalDocumentReceivedDate,
                              DocumentSentToCNF = c.DocumentSentToCNF,
                              GoodsDeliveryDateByCNF = c.GoodsDeliveryDateByCNF,
                              GoodsInHouseDate = c.GoodsInHouseDate,
                              AcceptanceValue = c.AcceptanceValue,
                              AcceptanceDate = c.AcceptanceDate,

                              BackToBackLCID = c.BackToBackLCID,
                              BackToBackLCNo = b.BackToBackLC1,

                              MaturityDate = c.MaturityDate,
                              Port = c.Port,
                              BillEntryNo = c.BillEntryNo,
                              BillEntryDate = c.BillEntryDate,

                              IsChalan = c.IsChalan,

                              Status = c.Status,
                              PassBookNo = c.PassBookNo
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueBL(string blNo, Nullable<int> blID = null)
        {
            IQueryable<int> result;

            if (blID == null)
            {
                result = from s in unitOfWork.BLRepository.Get()
                         where s.BLNo == blNo
                         select s.BLID;
            }
            else
            {
                result = from s in unitOfWork.BLRepository.Get()
                         where s.BLNo == blNo & s.BLID != blID
                         select s.BLID;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }

        public List<BLViewModel> GetAllBL(int? jobId = null, int? b2bLCId = null, int? blId = null, string invoiceNo = null)
        {
            var query = (from bl in unitOfWork.BLRepository.Get()
                         join b in unitOfWork.BackToBackLCRepository.Get() on bl.BackToBackLCID equals b.BackToBackLCID into bg
                         from b in bg.DefaultIfEmpty()
                         join j in unitOfWork.JobRepository.Get() on b.JobID equals j.JobInfoId into jg
                         from j in jg.DefaultIfEmpty()
                         where bl.IsChalan == false
                         select new { bl, b, j }).AsQueryable();

            if (jobId != null)
                query = query.Where(x => x.b.JobID == jobId);

            if (b2bLCId != null)
                query = query.Where(x => x.b.BackToBackLCID == b2bLCId);

            if (blId != null)
                query = query.Where(x => x.bl.BLID == blId).OrderByDescending(x=>x.bl.BLID).Take(10);

            if (!String.IsNullOrEmpty(invoiceNo))
                query = query.Where(x => x.bl.InvoiceNo.Contains(invoiceNo)).OrderByDescending(x => x.bl.BLID).Take(10);

            if (jobId == null && b2bLCId == null && blId == null)
                query = query.OrderByDescending(x=>x.bl.BLID).Take(10);

            var data = (from x in query
                        select new BLViewModel
                        {
                            BLID = x.bl.BLID,
                            BLNo = x.bl.BLNo,
                            BLDate = x.bl.BLDate,
                            InvoiceNo = x.bl.InvoiceNo,
                            InvoiceDate = x.bl.InvoiceDate,
                            CopyDocumentReceivedDate = x.bl.CopyDocumentReceivedDate,
                            OriginalDocumentReceivedDate = x.bl.OriginalDocumentReceivedDate,
                            DocumentSentToCNF = x.bl.DocumentSentToCNF,
                            GoodsDeliveryDateByCNF = x.bl.GoodsDeliveryDateByCNF,
                            GoodsInHouseDate = x.bl.GoodsInHouseDate,
                            AcceptanceValue = x.bl.AcceptanceValue,
                            AcceptanceDate = x.bl.AcceptanceDate,

                            MaturityDate = x.b != null ? DbFunctions.AddDays(x.bl.BLDate.Value, x.b.SightDays) : null,

                            BackToBackLCID = x.bl.BackToBackLCID,
                            BackToBackLCNo = x.b != null ? x.b.BackToBackLC1 : null,

                            JobId = x.j != null ? x.j.JobInfoId : 0,
                            JobNo = x.j != null ? x.j.JobNo : null,

                            Port = x.bl.Port,
                            PassBookNo = x.bl.PassBookNo,

                            BillEntryNo = x.bl.BillEntryNo,
                            BillEntryDate = x.bl.BillEntryDate,
                            BillEntryDsc = x.bl.BillEntryDsc,

                            IsChalan = x.bl.IsChalan,

                            Status = x.bl.Status,                    
                        }).ToList();


            return data;
        }
    }
}
