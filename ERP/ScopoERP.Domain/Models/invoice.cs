namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("invoice")]
    public partial class invoice
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public invoice()
        {
            shipment = new HashSet<shipment>();
        }

        public int InvoiceId { get; set; }

        public int? JobInfoId { get; set; }

        [Required]
        [StringLength(30)]
        public string InvoiceNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? InvoiceDate { get; set; }

        public decimal? InvoiceValue { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DocumentSentDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? TradeCardInPutDate { get; set; }

        [StringLength(100)]
        public string BL { get; set; }

        [Column("B/LDate", TypeName = "date")]
        public DateTime? B_LDate { get; set; }

        [StringLength(200)]
        public string BLToBeEndorsedTo { get; set; }

        [StringLength(100)]
        public string EXP { get; set; }

        [Column(TypeName = "date")]
        public DateTime? EXPDate { get; set; }

        [StringLength(100)]
        public string FCR { get; set; }

        [Column(TypeName = "date")]
        public DateTime? FCRDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BookingExFactoryDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ExFactoryDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BankNegoDate { get; set; }

        public int? BankForwardingID { get; set; }

        [Column("FDBP No")]
        [StringLength(100)]
        public string FDBP_No { get; set; }

        [Column(TypeName = "date")]
        public DateTime? OnBoardDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CODate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ICDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BLRealeaseDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DocDespatchDate { get; set; }

        [StringLength(100)]
        public string Courier { get; set; }

        [Column(TypeName = "date")]
        public DateTime? PaymentReceiveDate { get; set; }

        [StringLength(100)]
        public string TTNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? TTDate { get; set; }

        [StringLength(200)]
        public string ShippingBill { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ShippingBillDate { get; set; }

        public byte[] InvoiceFile { get; set; }

        [StringLength(200)]
        public string PortOfLoading { get; set; }

        [StringLength(200)]
        public string FinalDestination { get; set; }

        [StringLength(200)]
        public string CountryName { get; set; }

        public int? BankPrcTrackingID { get; set; }

        public decimal? PRCInvoiceAmount { get; set; }

        public decimal? PRCValue { get; set; }

        public decimal? PRCBDTaka { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DocsPaymentApprovalDate { get; set; }
        public DateTime? AcceptableBLDate { get; set; }
        public DateTime? AcceptablePaymentDate { get; set; }

        [StringLength(200)]
        public string PassBookNo { get; set; }

        [StringLength(200)]
        public string CustomHSCode { get; set; }

        public int? SightDays { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        [StringLength(255)]
        public string NotifyParty { get; set; }

        [StringLength(255)]
        public string ThirdNotifyParty { get; set; }

        [StringLength(255)]
        public string CATNo { get; set; }
        public string ForAccountandMessers { get; set; }

        public string Consignee { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<shipment> shipment { get; set; }
    }
}
