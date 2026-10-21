namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("bl")]
    public partial class bl
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public bl()
        {
            bldetails = new HashSet<bldetails>();
        }

        public int BLID { get; set; }

        [Required]
        [StringLength(250)]
        public string BLNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BLDate { get; set; }

        [StringLength(200)]
        public string InvoiceNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? InvoiceDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CopyDocumentReceivedDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? OriginalDocumentReceivedDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DocumentSentToCNF { get; set; }

        [Column(TypeName = "date")]
        public DateTime? GoodsDeliveryDateByCNF { get; set; }

        [Column(TypeName = "date")]
        public DateTime? GoodsInHouseDate { get; set; }

        public decimal? AcceptanceValue { get; set; }

        [Column(TypeName = "date")]
        public DateTime? AcceptanceDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? MaturityDate { get; set; }

        public bool? IsChalan { get; set; }

        public int? BackToBackLCID { get; set; }

        public bool Status { get; set; }

        public string Port { get; set; }

        public string BillEntryNo { get; set; }

        public DateTime? BillEntryDate { get; set; }

        public string BillEntryDsc { get; set; }

        [StringLength(200)]
        public string PassBookNo { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual backtobacklc backtobacklc { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<bldetails> bldetails { get; set; }
    }
}
