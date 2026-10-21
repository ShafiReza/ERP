namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class AccSysBranchTypeWiseAccount
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AccSysBranchTypeWiseAccount()
        {
            SubsidiaryAccounts = new HashSet<SubsidiaryAccount>();
        }

        [Key]
        public byte BranchTypeID { get; set; }

        [StringLength(50)]
        public string BranchTypeName { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SubsidiaryAccount> SubsidiaryAccounts { get; set; }
    }
}
