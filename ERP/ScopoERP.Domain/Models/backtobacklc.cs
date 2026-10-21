namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("backtobacklc")]
    public partial class backtobacklc
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public backtobacklc()
        {
            bl = new HashSet<bl>();           
            piinfo = new HashSet<piinfo>();          
        }

        public int BackToBackLCID { get; set; }

        [Column("BackToBackLC")]
        [Required]
        [StringLength(250)]
        public string BackToBackLC1 { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BackToBackLCDate { get; set; }

        public int? SightDays { get; set; }

        public int? MaturityDateCalculation { get; set; }

        //[Column(TypeName = "date")]
        //public DateTime? SpecificDate { get; set; }

        //[Column(TypeName = "date")]
        //public DateTime? MaturityDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BackToBackShippedDate { get; set; }

        public int? JobID { get; set; }

        public bool Status { get; set; }

        public decimal? BackToBackLCValue { get; set; }

        public int? LCTypeID { get; set; }

        public bool? EFD { get; set; }

        //[Column(TypeName = "date")]
        //public DateTime? PaymentDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public int? AmendmentNo { get; set; }

        public DateTime? AmendmentDate { get; set; }

        public decimal? B2BLCPreviousValue { get; set; }
         public DateTime? ExpiryDate { get; set; }
        public string ShipmentTo { get; set; }
        public string ShipmentFrom { get; set; }
        public int? ShipMode { get; set; }
        public string Clause { get; set; }
        public string InsuranceCoverNoteNo { get; set; }
        public DateTime? InsuranceCoverNoteDate { get; set; }
        public string HSCode { get; set; }
        public string CountryOfOrigin { get; set; }
        public string LCAFormNo { get; set; }

        public virtual jobinfo jobinfo { get; set; }

        public virtual paymenttype paymenttype { get; set; }

        public virtual ICollection<bl> bl { get; set; }
        public virtual ICollection<BackToBackLCPayment> BackToBackLCPayments { get; set; }
        public virtual ICollection<piinfo> piinfo { get; set; }
    }
}
