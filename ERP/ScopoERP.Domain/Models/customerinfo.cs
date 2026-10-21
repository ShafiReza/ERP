namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("customerinfo")]
    public partial class customerinfo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public customerinfo()
        {
            styleinfo = new HashSet<styleinfo>();
        }

        [Key]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(30)]
        public string CustomerName { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<styleinfo> styleinfo { get; set; }
    }
}
