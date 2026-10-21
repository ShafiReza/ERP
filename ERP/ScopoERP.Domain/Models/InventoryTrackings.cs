namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class InventoryTrackings
    {
        [Key]
        public int InventoryTrackingID { get; set; }

        public int PIID { get; set; }

        public string Color { get; set; }

        [Required]
        public string RollNo { get; set; }

        public string Construction { get; set; }

        [Required]
        public string LotNo { get; set; }

        public string StackNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? OutDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? InDate { get; set; }

        public int? ActionType { get; set; }

        [Column(TypeName = "date")]
        public DateTime? SetupDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
