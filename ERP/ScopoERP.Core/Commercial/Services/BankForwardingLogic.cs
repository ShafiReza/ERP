using ScopoERP.Commercial.ViewModel;
using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Commercial.BankForwardingL
{
    public class BankForwardingLogic
    {
        private UnitOfWork unitOfWork;
        private bankforwarding bankForwarding;
        private invoice invoice;

        public BankForwardingLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<BankForwardingViewModel> GetAllBankForwarding(int? jobID, int? bankForwardingId)
        {
            var query = (from c in unitOfWork.BankForwardingRepository.Get()
                         join j in unitOfWork.JobRepository.Get() on c.JobID equals j.JobInfoId
                         orderby c.BankForwardingID descending
                         select new BankForwardingViewModel
                         {
                             BankForwardingID = c.BankForwardingID,
                             BankForwardingNo = c.BankForwardingNo,
                             BankForwardingDate = c.BankForwardingDate,
                             Courier = c.Courier,
                             FDBPNo = c.FDBPNo,
                             JobID = c.JobID,
                             JobNo = j.JobNo,
                             BankID = j.BankID,
                             CompanyID = j.CompanyID,
                             UserID = c.UserID,
                             SetupDate = c.SetupDate
                         }).AsQueryable();

            if (jobID != null)
                query = query.Where(x => x.JobID == jobID);
            if (bankForwardingId != null)
                query = query.Where(x => x.BankForwardingID == bankForwardingId);

            return query.Take(10).ToList();
        }

        public BankForwardingViewModel GetBankForwardingByID(int bankForwardingID)
        {
            var result = (from c in unitOfWork.BankForwardingRepository.Get()
                          join j in unitOfWork.JobRepository.Get() on c.JobID equals j.JobInfoId
                          where c.BankForwardingID == bankForwardingID
                          select new BankForwardingViewModel
                          {
                              BankForwardingID = c.BankForwardingID,
                              BankForwardingNo = c.BankForwardingNo,
                              BankForwardingDate = c.BankForwardingDate,
                              FDBPNo = c.FDBPNo,
                              Courier = c.Courier,
                              JobID = c.JobID,
                              JobNo= j.JobNo,
                              ContractNo = j.ContractNo,
                              BankID = j.BankID,
                              CompanyID = j.CompanyID,
                              UserID = c.UserID,
                              SetupDate = c.SetupDate
                          }).SingleOrDefault();

            var invoiceList = (from p in unitOfWork.ExportInvoiceRepository.Get()
                               where p.BankForwardingID == bankForwardingID
                               select new InvoiceSummary
                               {
                                   InvoiceID = p.InvoiceId,
                                   InvoiceNo = p.InvoiceNo,
                                   InvoiceDate = p.InvoiceDate,
                                   InvoiceQuantity = p.shipment.Sum(x => x.ChalanQuantity),
                                   InvoiceValue = p.shipment.Sum(x => x.InvoiceFOB),
                                   EXPNo = p.EXP,
                                   BLToBeEndorsedTo = p.BLToBeEndorsedTo
                               }).OrderBy(x => x.InvoiceNo).ToList();

            result.InvoiceList = invoiceList;

            return result;
        }

        public string CreateBankForwarding(BankForwardingViewModel bankForwardingVM, int userID)
        {
            this.bankForwarding = new bankforwarding()
            {
                BankForwardingNo = GetNewForwardingNo(),
                BankForwardingDate = bankForwardingVM.BankForwardingDate,
                FDBPNo = bankForwardingVM.FDBPNo,
                JobID = bankForwardingVM.JobID,
                Courier = bankForwardingVM.Courier,
                Status = true,
                UserID = userID,
                SetupDate = DateTime.Now
            };

            unitOfWork.BankForwardingRepository.Insert(bankForwarding);
            unitOfWork.Save();

            if (bankForwardingVM.InvoiceList != null)
            {
                foreach (var item in bankForwardingVM.InvoiceList)
                {
                    invoice = unitOfWork.ExportInvoiceRepository.Get().SingleOrDefault(x => x.InvoiceId == item.InvoiceID);
                    invoice.BankForwardingID = bankForwarding.BankForwardingID;

                    unitOfWork.ExportInvoiceRepository.Update(invoice);
                }
            }

            unitOfWork.Save();

            return bankForwarding.BankForwardingNo;
        }

        public string UpdateBankForwarding(BankForwardingViewModel bankForwardingVM)
        {
            this.bankForwarding = new bankforwarding()
            {
                BankForwardingID = bankForwardingVM.BankForwardingID,
                BankForwardingNo = bankForwardingVM.BankForwardingNo,
                BankForwardingDate = bankForwardingVM.BankForwardingDate,
                FDBPNo = bankForwardingVM.FDBPNo,
                Courier = bankForwardingVM.Courier,
                JobID = bankForwardingVM.JobID,
                Status = true,
                UserID = bankForwardingVM.UserID,
                SetupDate = bankForwardingVM.SetupDate
            };
            unitOfWork.BankForwardingRepository.Update(bankForwarding);

            var invoiceList = (from s in unitOfWork.ExportInvoiceRepository.Get()
                               where s.BankForwardingID == bankForwardingVM.BankForwardingID
                               select s).ToList();



            foreach (var item in invoiceList)
            {
                invoice = unitOfWork.ExportInvoiceRepository.Get().SingleOrDefault(x => x.InvoiceId == item.InvoiceId);
                invoice.BankForwardingID = null;

                unitOfWork.ExportInvoiceRepository.Update(invoice);
            }

            if (bankForwardingVM.InvoiceList != null)
            {
                foreach (var item in bankForwardingVM.InvoiceList)
                {
                    invoice = unitOfWork.ExportInvoiceRepository.Get().SingleOrDefault(x => x.InvoiceId == item.InvoiceID);
                    invoice.BankForwardingID = bankForwarding.BankForwardingID;

                    unitOfWork.ExportInvoiceRepository.Update(invoice);
                }
            }

            unitOfWork.Save();

            return bankForwarding.BankForwardingNo;
        }

        public string GetNewForwardingNo()
        {
            string newBankForwardingNo = string.Empty;

            var result = (from c in unitOfWork.BankForwardingRepository.Get()
                          orderby c.BankForwardingID descending
                          select c.BankForwardingNo).FirstOrDefault();

            if (result == null)
            {
                newBankForwardingNo = "FRD-" + DateTime.Now.Year.ToString() + "-00001";
            }
            else
            {
                string newBankForwardingNoInDigit = (Convert.ToInt32(result.Split('-').Last()) + 1).ToString().PadLeft(5, '0');

                newBankForwardingNo = "FRD-" + DateTime.Now.Year.ToString() + "-" + newBankForwardingNoInDigit;
            }

            return newBankForwardingNo;
        }
    }
}
