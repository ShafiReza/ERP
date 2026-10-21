namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("PurchaseRequisition")]
    public partial class PurchaseRequisition
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PurchaseRequisition()
        {
            PurchaseRequisitionDetails = new HashSet<PurchaseRequisitionDetail>();
        }

        public int PurchaseRequisitionID { get; set; }

        [Required]
        [StringLength(50)]
        public string RequisitionNo { get; set; }

        public DateTime RequisitionDate { get; set; }

        public string Remarks { get; set; }

        [StringLength(30)]
        public string Company { get; set; }
        public int? CompanyId { get; set; }

        public int DepartmentID { get; set; }
        public int? Status { get; set; }
        public DateTime? ApproxPaymentDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string SourceOfFund { get; set; }
        public string UserID { get; set; }

        public DateTime? SetDate { get; set; }
        public DateTime? SCApproveDate { get; set; }
        public DateTime? FinanceApproveDate { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PurchaseRequisitionDetail> PurchaseRequisitionDetails { get; set; }
    }
}
