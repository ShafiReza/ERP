using ScopoERP.Commercial.ViewModel;
using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Store.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Commercial.BLL
{
    public class ExportInvoiceLogic
    {
        private UnitOfWork unitOfWork;

        public ExportInvoiceLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateExportInvoice(ExportInvoiceViewModel exportInvoiceVM)
        {
            invoice invoice = new invoice
            {
                InvoiceNo = exportInvoiceVM.InvoiceNo,
                InvoiceDate = exportInvoiceVM.InvoiceDate,
                InvoiceValue = exportInvoiceVM.InvoiceValue,

                JobInfoId = exportInvoiceVM.JobID,

                DocumentSentDate = exportInvoiceVM.DocumentSentDate,
                TradeCardInPutDate = exportInvoiceVM.TradeCardInPutDate,

                BL = exportInvoiceVM.BL,
                B_LDate = exportInvoiceVM.B_LDate,
                BLToBeEndorsedTo = exportInvoiceVM.BLToBeEndorsedTo,

                EXP = exportInvoiceVM.EXP,
                EXPDate = exportInvoiceVM.EXPDate,

                FCR = exportInvoiceVM.FCR,
                FCRDate = exportInvoiceVM.FCRDate,

                BookingExFactoryDate = exportInvoiceVM.BookingExFactoryDate,
                ExFactoryDate = exportInvoiceVM.ExFactoryDate,

                BankNegoDate = exportInvoiceVM.BankNegoDate,
                FDBP_No = exportInvoiceVM.FDBP_No,
                OnBoardDate = exportInvoiceVM.OnBoardDate,
                CODate = exportInvoiceVM.CODate,
                ICDate = exportInvoiceVM.ICDate,
                SightDays=exportInvoiceVM.SightDays,

                BLRealeaseDate = exportInvoiceVM.BLRealeaseDate,
                DocDespatchDate = exportInvoiceVM.DocDespatchDate,
                DocsPaymentApprovalDate = exportInvoiceVM.DocsPaymentApprovalDate,

                Courier = exportInvoiceVM.Courier,
                PaymentReceiveDate = exportInvoiceVM.PaymentReceiveDate,
                AcceptableBLDate = exportInvoiceVM.AcceptableBLDate,
                AcceptablePaymentDate = exportInvoiceVM.AcceptablePaymentDate,

                ShippingBill = exportInvoiceVM.ShippingBill,
                ShippingBillDate = exportInvoiceVM.ShippingBillDate,
                PortOfLoading = exportInvoiceVM.PortOfLoading,
                FinalDestination = exportInvoiceVM.FinalDestination,
                CountryName = exportInvoiceVM.CountryName,

                TTNo = exportInvoiceVM.TTNo,
                TTDate = exportInvoiceVM.TTDate,
                PassBookNo = exportInvoiceVM.PassBookNo,
                CustomHSCode = exportInvoiceVM.CustomHSCode,
                NotifyParty=exportInvoiceVM.NotifyParty,
                ThirdNotifyParty=exportInvoiceVM.ThirdNotifyParty,
                CATNo="CAT#"+exportInvoiceVM.CATNo,
                Consignee=exportInvoiceVM.Consignee,
                ForAccountandMessers=exportInvoiceVM.ForAccountandMessers
            };

            if (exportInvoiceVM.ShipmentList.Count > 0)
            {
                foreach (var item in exportInvoiceVM.ShipmentList)
                {
                    unitOfWork.ShipmentRepository.Insert(new shipment
                    {
                        InvoiceID = invoice.InvoiceId,
                        PurchaseOrderID = item.PurchaseOrderID,
                        ChalanQuantity = item.ChalanQuantity,
                        ChalanDate = item.ChalanDate,
                        InvoiceFOB = item.InvoiceFOB,
                        CartoonQuantity = item.CartoonQuantity,
                        GrossWeight = item.GrossWeight,
                        NetWeight = item.NetWeight,
                        UserID = 0,
                        SetupDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now
                    });            
                }
            }

            unitOfWork.ExportInvoiceRepository.Insert(invoice);
            unitOfWork.Save();
        }

        public void UpdateExportInvoice(ExportInvoiceViewModel exportInvoiceVM)
        {
            var invoice = unitOfWork.ExportInvoiceRepository.GetById(exportInvoiceVM.InvoiceId);

            invoice.InvoiceId = exportInvoiceVM.InvoiceId;
            invoice.InvoiceNo = exportInvoiceVM.InvoiceNo;
            invoice.InvoiceDate = exportInvoiceVM.InvoiceDate;
            invoice.InvoiceValue = exportInvoiceVM.InvoiceValue;

            invoice.JobInfoId = exportInvoiceVM.JobID;

            invoice.DocumentSentDate = exportInvoiceVM.DocumentSentDate;
            invoice.TradeCardInPutDate = exportInvoiceVM.TradeCardInPutDate;

            invoice.BL = exportInvoiceVM.BL;
            invoice.B_LDate = exportInvoiceVM.B_LDate;
            invoice.BLToBeEndorsedTo = exportInvoiceVM.BLToBeEndorsedTo;

            invoice.EXP = exportInvoiceVM.EXP;
            invoice.EXPDate = exportInvoiceVM.EXPDate;

            invoice.FCR = exportInvoiceVM.FCR;
            invoice.FCRDate = exportInvoiceVM.FCRDate;

            invoice.BookingExFactoryDate = exportInvoiceVM.BookingExFactoryDate;
            invoice.ExFactoryDate = exportInvoiceVM.ExFactoryDate;

            invoice.BankNegoDate = exportInvoiceVM.BankNegoDate;
            invoice.FDBP_No = exportInvoiceVM.FDBP_No;
            invoice.OnBoardDate = exportInvoiceVM.OnBoardDate;
            invoice.CODate = exportInvoiceVM.CODate;
            invoice.ICDate = exportInvoiceVM.ICDate;
            invoice.SightDays = exportInvoiceVM.SightDays;

            invoice.BLRealeaseDate = exportInvoiceVM.BLRealeaseDate;
            invoice.DocDespatchDate = exportInvoiceVM.DocDespatchDate;
            invoice.DocsPaymentApprovalDate = exportInvoiceVM.DocsPaymentApprovalDate;

            invoice.Courier = exportInvoiceVM.Courier;
            invoice.PaymentReceiveDate = exportInvoiceVM.PaymentReceiveDate;
            invoice.AcceptableBLDate = exportInvoiceVM.AcceptableBLDate;
            invoice.AcceptablePaymentDate = exportInvoiceVM.AcceptablePaymentDate;

            invoice.ShippingBill = exportInvoiceVM.ShippingBill;
            invoice.ShippingBillDate = exportInvoiceVM.ShippingBillDate;
            invoice.PortOfLoading = exportInvoiceVM.PortOfLoading;
            invoice.FinalDestination = exportInvoiceVM.FinalDestination;
            invoice.CountryName = exportInvoiceVM.CountryName;

            invoice.TTNo = exportInvoiceVM.TTNo;
            invoice.TTDate = exportInvoiceVM.TTDate;
            invoice.PassBookNo = exportInvoiceVM.PassBookNo;
            invoice.CustomHSCode = exportInvoiceVM.CustomHSCode;
            invoice.NotifyParty = exportInvoiceVM.NotifyParty;
            invoice.ThirdNotifyParty = exportInvoiceVM.ThirdNotifyParty;
            invoice.CATNo = "CAT#"+exportInvoiceVM.CATNo;
            invoice.Consignee = exportInvoiceVM.Consignee;
            invoice.ForAccountandMessers = exportInvoiceVM.ForAccountandMessers;


            var shipmentList = unitOfWork.ShipmentRepository.Get().Where(x => x.InvoiceID == invoice.InvoiceId).ToList();
            unitOfWork.ShipmentRepository.DeleteRange(shipmentList);
            
            if (exportInvoiceVM.ShipmentList.Count > 0)
            {             
                foreach (var item in exportInvoiceVM.ShipmentList)
                {
                    unitOfWork.ShipmentRepository.Insert(new shipment
                    {
                        InvoiceID = invoice.InvoiceId,
                        PurchaseOrderID = item.PurchaseOrderID,
                        ChalanQuantity = item.ChalanQuantity,
                        ChalanDate = item.ChalanDate,
                        InvoiceFOB = item.InvoiceFOB,
                        CartoonQuantity = item.CartoonQuantity,
                        GrossWeight = item.GrossWeight,
                        NetWeight = item.NetWeight,
                        UserID = 0,
                        SetupDate = DateTime.Now,
                        LastModifiedDate = DateTime.Now
                    });
                }
            }

            unitOfWork.ExportInvoiceRepository.Update(invoice);
            unitOfWork.Save();
        }

        public List<ExportInvoiceViewModel> GetAllExportInvoice(int pageIndex, int pageSize, bool excelExport, int? jobId, int? invoiceId, DateTime? fromDate, DateTime? toDate)
        {
            var query = (from s in unitOfWork.ExportInvoiceRepository.Get()
                         join j in unitOfWork.JobRepository.Get() on s.JobInfoId equals j.JobInfoId
                         join bfrw in unitOfWork.BankForwardingRepository.Get() on s.BankForwardingID equals bfrw.BankForwardingID into bg
                         from bf in bg.DefaultIfEmpty()
                         orderby s.InvoiceId descending
                         select new ExportInvoiceViewModel
                         {
                             InvoiceId = s.InvoiceId,
                             InvoiceNo = s.InvoiceNo,
                             InvoiceDate = s.InvoiceDate,
                             JobID = s.JobInfoId,
                             JobNo = j.JobNo,

                             DocumentSentDate = s.DocumentSentDate,
                             TradeCardInPutDate = s.TradeCardInPutDate,

                             BL = s.BL,
                             BLRealeaseDate = s.BLRealeaseDate,
                             B_LDate = s.B_LDate,
                             BLToBeEndorsedTo = s.BLToBeEndorsedTo,

                             EXP = s.EXP,
                             EXPDate = s.EXPDate,

                             FCR = s.FCR,
                             FCRDate = s.FCRDate,
                             AcceptableBLDate = s.AcceptableBLDate,
                             AcceptablePaymentDate = s.AcceptablePaymentDate,
                             BookingExFactoryDate = s.BookingExFactoryDate,
                             ExFactoryDate = s.ExFactoryDate,
                             BankNegoDate = s.BankNegoDate,
                             FDBP_No = string.IsNullOrEmpty(bf.FDBPNo) ? s.FDBP_No : bf.FDBPNo,
                             OnBoardDate = s.OnBoardDate,
                             CODate = s.CODate,
                             ICDate = s.ICDate,
                             DocDespatchDate = s.DocDespatchDate,
                             DocsPaymentApprovalDate = s.DocsPaymentApprovalDate,
                             Courier = s.Courier,
                             PaymentReceiveDate = s.PaymentReceiveDate,
                             SightDays = s.SightDays,

                             ShippingBill = s.ShippingBill,
                             ShippingBillDate = s.ShippingBillDate,
                             PortOfLoading = s.PortOfLoading,
                             FinalDestination = s.FinalDestination,
                             CountryName = s.CountryName,

                             TTNo = s.TTNo,
                             TTDate = s.TTDate,
                             PassBookNo = s.PassBookNo,
                             CustomHSCode = s.CustomHSCode,

                             InvoiceQuantity = s.shipment.Sum(x => x.ChalanQuantity),
                             InvoiceValue = s.shipment.Sum(x => x.InvoiceFOB),
                         }).AsQueryable();

            if (jobId != null)
                query = query.Where(x => x.JobID == jobId);

            if (invoiceId != null)
                query = query.Where(x => x.InvoiceId == invoiceId);

            if (fromDate != null && toDate != null)
                query = query.Where(x => x.InvoiceDate >= fromDate && x.InvoiceDate <= toDate);

            if (!excelExport)
                query = query.Skip(pageSize * pageIndex).Take(pageSize);

            return query.ToList();
        }

        public ExportInvoiceViewModel GetExportInvoiceByID(int invoiceID)
        {
            var result = (from s in unitOfWork.ExportInvoiceRepository.Get()
                          join bfrw in unitOfWork.BankForwardingRepository.Get() on s.BankForwardingID equals bfrw.BankForwardingID into bg
                          from bf in bg.DefaultIfEmpty()
                          join j in unitOfWork.JobRepository.Get() on s.JobInfoId equals j.JobInfoId
                          join c in unitOfWork.CompanyRepository.Get() on j.CompanyID equals c.CompanyID
                          join b in unitOfWork.BankRepository.Get() on j.BankID equals b.BankID
                          where s.InvoiceId == invoiceID
                          select new ExportInvoiceViewModel
                          {
                              InvoiceId = s.InvoiceId,
                              InvoiceNo = s.InvoiceNo,
                              InvoiceDate = s.InvoiceDate,
                              InvoiceValue = s.InvoiceValue,

                              JobID = s.JobInfoId,

                              DocumentSentDate = s.DocumentSentDate,
                              TradeCardInPutDate = s.TradeCardInPutDate,

                              BL = s.BL,
                              BLRealeaseDate = s.BLRealeaseDate,
                              B_LDate = s.B_LDate,
                              BLToBeEndorsedTo = s.BLToBeEndorsedTo,

                              BankName = b.BankName,
                              BankAddress= b.BankAddress,
                              SwiftNo = b.SwiftCode,
                              AccountNo= b.AccountNo,

                              ContractNo = j.ContractNo,
                              ContractDate = j.ContractDate,

                              EXP = s.EXP,
                              EXPDate = s.EXPDate,

                              CompanyName = c.CompanyName,
                              CompanyAddress= c.CompanyAddress,

                              FCR = s.FCR,
                              FCRDate = s.FCRDate,
                              AcceptableBLDate = s.AcceptableBLDate,
                              AcceptablePaymentDate = s.AcceptablePaymentDate,
                              BookingExFactoryDate = s.BookingExFactoryDate,
                              ExFactoryDate = s.ExFactoryDate,
                              BankNegoDate = s.BankNegoDate,
                              FDBP_No = string.IsNullOrEmpty(bf.FDBPNo) ? s.FDBP_No : bf.FDBPNo,
                              OnBoardDate = s.OnBoardDate,
                              CODate = s.CODate,
                              ICDate = s.ICDate,
                              DocDespatchDate = s.DocDespatchDate,
                              DocsPaymentApprovalDate = s.DocsPaymentApprovalDate,
                              Courier = s.Courier,
                              PaymentReceiveDate = s.PaymentReceiveDate,
                              SightDays = s.SightDays,

                              ForAccountandMessers= s.ForAccountandMessers,
                              NotifyParty = s.NotifyParty,
                              ThirdNotifyParty= s.ThirdNotifyParty,

                              ShippingBill = s.ShippingBill,
                              ShippingBillDate = s.ShippingBillDate,
                              PortOfLoading = s.PortOfLoading,
                              FinalDestination = s.FinalDestination,
                              CountryName = s.CountryName,
                              TTNo = s.TTNo,
                              TTDate = s.TTDate,
                              PassBookNo = s.PassBookNo,
                              CustomHSCode = s.CustomHSCode,
                              BankForwardingID = s.BankForwardingID
                          }).SingleOrDefault();


            var shipmentList = (from s in unitOfWork.ShipmentRepository.Get()
                                join p in unitOfWork.PurchaseOrderRepository.Get() on s.PurchaseOrderID equals p.PoStyleId
                                join st in unitOfWork.StyleRepository.Get() on p.StyleId equals st.StyleId
                                where s.InvoiceID == invoiceID
                                select new ShipmentViewModel
                                {
                                    PurchaseOrderID = s.PurchaseOrderID,
                                    PONo = p.PoNo,
                                    StyleNo = st.StyleNo,
                                    OrderQuantity = p.OrderQuantity,
                                    FOB = p.Fob,
                                    TotalFOB = p.Fob * p.OrderQuantity,
                                    ChalanQuantity = s.ChalanQuantity,
                                    ChalanDate = s.ChalanDate,
                                    InvoiceFOB = s.InvoiceFOB,
                                    GrossWeight = s.GrossWeight,
                                    NetWeight = s.NetWeight,
                                    CartoonQuantity = s.CartoonQuantity,

                                }).ToList();

            result.ShipmentList = shipmentList;

            return result;
        }

        public bool IsUniqueInvoiceNo(string invoiceNo, int? invoiceID = null)
        {
            int count = unitOfWork.ExportInvoiceRepository.Get()
                .Count(s => s.InvoiceNo == invoiceNo && (invoiceID == null || s.InvoiceId != invoiceID));

            return count == 0;
        }
    }
}
