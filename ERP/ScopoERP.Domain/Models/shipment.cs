namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("shipment")]
    public partial class shipment
    {
        public int ShipmentID { get; set; }

        public int PurchaseOrderID { get; set; }

        public int? ChalanID { get; set; }

        public int ChalanQuantity { get; set; }

        public decimal? CBM { get; set; }

        public decimal? CartoonQuantity { get; set; }
        public decimal? GrossWeight { get; set; }
        public decimal? NetWeight { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ChalanDate { get; set; }

        public int? InvoiceID { get; set; }

        public decimal? InvoiceFOB { get; set; }

        [StringLength(500)]
        public string Destination { get; set; }

        public int UserID { get; set; }

        public DateTime SetupDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual chalanexport chalanexport { get; set; }

        public virtual invoice invoice { get; set; }

        public virtual postyle postyle { get; set; }
    }
}
