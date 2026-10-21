namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class SubsidiaryAccount
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SubsidiaryAccount()
        {
            TransactionDetails = new HashSet<TransactionDetail>();
        }

        [Key]
        public int AccountID { get; set; }

        [Required]
        [StringLength(15)]
        public string AccountNo { get; set; }

        [Required]
        [StringLength(255)]
        public string AccountName { get; set; }

        public int ParentID { get; set; }

        public DateTime? CreationDate { get; set; }

        public byte AccountTypeID { get; set; }

        public bool IsAutoEntry { get; set; }

        public byte BranchTypeWiseAccount { get; set; }

        public int CashFlowID { get; set; }

        public int AccountIdentityNo { get; set; }

        public DateTime? ClosingDate { get; set; }

        public byte StatusID { get; set; }

        [Required]
        [StringLength(50)]
        public string UserID { get; set; }

        public virtual AccSysAccountIdentity AccSysAccountIdentity { get; set; }

        public virtual AccSysAccountType AccSysAccountType { get; set; }

        public virtual AccSysBranchTypeWiseAccount AccSysBranchTypeWiseAccount { get; set; }

        public virtual CashFlowHead CashFlowHead { get; set; }

        public virtual ParentAccount ParentAccount { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TransactionDetail> TransactionDetails { get; set; }
    }
}
