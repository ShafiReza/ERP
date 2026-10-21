namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class CashFlowHead
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CashFlowHead()
        {
            SubsidiaryAccounts = new HashSet<SubsidiaryAccount>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int CashFlowID { get; set; }

        [Required]
        [StringLength(50)]
        public string HeadName { get; set; }

        public int? ParentICashFlowID { get; set; }

        public byte? CFParentOrder { get; set; }

        public DateTime? SetupDate { get; set; }

        public int? UserID { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SubsidiaryAccount> SubsidiaryAccounts { get; set; }
    }
}
