namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("piinfo")]
    public partial class piinfo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public piinfo()
        {
            booking = new HashSet<booking>();
            excessbooking = new HashSet<excessbooking>();
        }

        [Key]
        public int PIID { get; set; }

        [Required]
        [StringLength(200)]
        public string ReferenceNo { get; set; }

        [StringLength(200)]
        public string PINo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? PIDate { get; set; }

        public int? SupplierID { get; set; }

        public int? BackToBackLCID { get; set; }

        public int? RequisitionID { get; set; }

        public int? JobID { get; set; }

        public int? LoanFromJobID { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ApproximateInhouseDate { get; set; }

        [StringLength(500)]
        public string BookedPo { get; set; }

        public int Status { get; set; }

        public decimal? Discount { get; set; }

        public string OrderRefNo { get; set; }
        public DateTime? OrderDate { get; set; }


        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual backtobacklc backtobacklc { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<booking> booking { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<excessbooking> excessbooking { get; set; }

        public virtual jobinfo jobinfo { get; set; }


    }
}
