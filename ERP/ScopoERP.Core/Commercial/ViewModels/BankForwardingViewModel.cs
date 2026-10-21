using System;
using System.Collections.Generic;

namespace ScopoERP.Commercial.ViewModel
{
    public class BankForwardingViewModel
    {
        public int BankForwardingID { get; set; }
        public string BankForwardingNo { get; set; }
        public DateTime BankForwardingDate { get; set; }
        public string FDBPNo { get; set; }
        
        public int JobID { get; set; }
        public string JobNo { get; set; }
        public string ContractNo { get; set; }
        public int? BankID { get; set; }
        public int? CompanyID { get; set; }

        public bool Status { get; set; }
        public int UserID { get; set; }
        public DateTime SetupDate { get; set; }
        public string Courier { get; set; }

        public decimal? TotalValue { get; set; }

        public List<InvoiceSummary> InvoiceList { get; set; }
    }

    public class InvoiceSummary
    {
        public int InvoiceID { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public int? InvoiceQuantity { get; set; }
        public decimal? InvoiceValue { get; set; }

        public string EXPNo { get; set; }
        public string BLToBeEndorsedTo { get; set; }
    }
}
