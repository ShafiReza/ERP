using ScopoERP.Store.ViewModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Commercial.ViewModel
{
    public class ExportInvoiceViewModel
    {
        public int? JobID { get; set; }

        public string JobNo { get; set; }

        public string CompanyAddress { get; set; }
        public string CompanyName { get; set; }

        public string ContractNo { get; set; }
        public DateTime? ContractDate { get; set; }

        public int InvoiceId { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Invoice No")]
        public string InvoiceNo { get; set; }

        [Display(Name = "Invoice Date")]
        public DateTime? InvoiceDate { get; set; }

        [Display(Name = "Invoice Value")]
        public Decimal? InvoiceValue { get; set; }

        [Display(Name = "Document Sent Date")]
        public DateTime? DocumentSentDate { get; set; }

        [Display(Name = "Trade CardInPut Date")]
        public DateTime? TradeCardInPutDate { get; set; }
        public string BL { get; set; }

        [Display(Name = "B/L Date")]
        public DateTime? B_LDate { get; set; }

        [Display(Name = "BL To Be Endorsed To")]
        public string BLToBeEndorsedTo { get; set; }

        public string EXP { get; set; }

        [Display(Name = "EXP Date")]
        public DateTime? EXPDate { get; set; }

        public string FCR { get; set; }

        [Display(Name = "FCR Date")]
        public DateTime? FCRDate { get; set; }

        [Display(Name = "Bookibg Factory Date")]
        public DateTime? BookingExFactoryDate { get; set; }

        [Display(Name = "Ex Factory Date")]
        public DateTime? ExFactoryDate { get; set; }

        [Display(Name = "Bank Nego Date")]
        public DateTime? BankNegoDate { get; set; }

        [Display(Name = "FDBP No")]
        public string FDBP_No { get; set; }

        [Display(Name = "On Board Date")]
        public DateTime? OnBoardDate { get; set; }

        [Display(Name = "C/O Date")]
        public DateTime? CODate { get; set; }

        [Display(Name = "I.C Date")]
        public DateTime? ICDate { get; set; }

        [Display(Name = "B/L Release Date")]
        public DateTime? BLRealeaseDate { get; set; }

        [Display(Name = "Doc Despatch Date")]
        public DateTime? DocDespatchDate { get; set; }
        [Display(Name = "Doc Payment App. Date")]
        public DateTime? DocsPaymentApprovalDate { get; set; }
        public string Courier { get; set; }

        [Display(Name = "Payment Receive Date")]
        public DateTime? PaymentReceiveDate { get; set; }

        [Display(Name = "Shipping  Bill")]
        public string ShippingBill { get; set; }

        [Display(Name = "Shipping Bill Date")]
        public DateTime? ShippingBillDate { get; set; }
        public DateTime? AcceptableBLDate { get; set; }
        public DateTime? AcceptablePaymentDate { get; set; }

        //public HttpPostedFileBase InvoiceFile { get; set; }

        public string PortOfLoading { get; set; }
        public string FinalDestination { get; set; }
        public string CountryName { get; set; }

        public int? BankForwardingID { get; set; }
        public int? SightDays { get; set; }
        public string NotifyParty { get; set; }
        public string ThirdNotifyParty { get; set; }
        public string CATNo { get; set; }
        public string ForAccountandMessers { get; set; }

        public string BankName { get; set; }
        public string BankAddress { get; set; }
        public string SwiftNo { get; set; }
        public string AccountNo { get; set; }

        public string Consignee { get; set; }

        public string TTNo { get; set; }
        public DateTime? TTDate { get; set; }
        public string PassBookNo { get; set; }
        public string CustomHSCode { get; set; }
        public List<ShipmentViewModel> ShipmentList { get; set; }

        public int? InvoiceQuantity { get; set; }
    }
}