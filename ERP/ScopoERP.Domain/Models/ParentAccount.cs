namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ParentAccount
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ParentAccount()
        {
            SubsidiaryAccounts = new HashSet<SubsidiaryAccount>();
            ParentAccounts1 = new HashSet<ParentAccount>();
        }

        [Key]
        public int AccountID { get; set; }

        [Required]
        [StringLength(15)]
        public string AccountNo { get; set; }

        [StringLength(255)]
        public string AccountName { get; set; }

        public int? ParentID { get; set; }

        public byte AccountTypeID { get; set; }

        public DateTime? CreationDate { get; set; }

        [StringLength(50)]
        public string UserID { get; set; }

        public virtual AccSysAccountType AccSysAccountType { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SubsidiaryAccount> SubsidiaryAccounts { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ParentAccount> ParentAccounts1 { get; set; }

        public virtual ParentAccount ParentAccount1 { get; set; }
    }
}
