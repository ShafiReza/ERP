namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class CostCenter
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CostCenter()
        {
            TransactionDetails = new HashSet<TransactionDetail>();
        }

        public int CostCenterID { get; set; }

        [StringLength(30)]
        public string CostCenterName { get; set; }

        public bool? Status { get; set; }

        public DateTime SetupDate { get; set; }

        [Required]
        [StringLength(50)]
        public string UserID { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TransactionDetail> TransactionDetails { get; set; }
    }
}
