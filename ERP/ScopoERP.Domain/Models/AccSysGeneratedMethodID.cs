namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class AccSysGeneratedMethodID
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AccSysGeneratedMethodID()
        {
            AccPolicyLastNumbers = new HashSet<AccPolicyLastNumber>();
        }

        [Key]
        public byte GeneratedMethodID { get; set; }

        [StringLength(50)]
        public string GeneratedMethodName { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AccPolicyLastNumber> AccPolicyLastNumbers { get; set; }
    }
}
