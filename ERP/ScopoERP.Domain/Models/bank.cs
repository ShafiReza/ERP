namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("bank")]
    public partial class bank
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public bank()
        {
            jobinfo = new HashSet<jobinfo>();
        }

        public int BankID { get; set; }

        [Required]
        [StringLength(200)]
        public string BankName { get; set; }

        [Required]
        public string BankAddress { get; set; }

        public int UserID { get; set; }

        public DateTime SetDate { get; set; }

        public string AccountNo { get; set; }

        public string SwiftCode { get; set; }

        public decimal? CreditLimit { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<jobinfo> jobinfo { get; set; }
    }
}
