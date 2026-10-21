namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("floorline")]
    public partial class floorline
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public floorline()
        {
            productionplanning = new HashSet<productionplanning>();
        }

        public int FloorLineId { get; set; }

        [Required]
        [StringLength(15)]
        public string Floor { get; set; }

        [Required]
        [StringLength(15)]
        public string Line { get; set; }

        [Required]
        [StringLength(1)]
        public string Devision { get; set; }

        public int Status { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<productionplanning> productionplanning { get; set; }
    }
}
