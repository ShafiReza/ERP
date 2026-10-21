namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("chalan")]
    public partial class chalan
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]     

        public int ChalanID { get; set; }

        [Required]
        [StringLength(200)]
        public string ChalanNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime ReceivedDate { get; set; }

        [Required]
        [StringLength(200)]
        public string ReceivedBy { get; set; }

        [Column(TypeName = "date")]
        public DateTime CreatedDate { get; set; }

        public int CreatedBy { get; set; }

        [StringLength(400)]
        public string Remarks { get; set; }

        public short Status { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
