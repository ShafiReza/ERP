namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("bookinghistory")]
    public partial class bookinghistory
    {
        [Key]
        public int BookingID { get; set; }

        public int PurchaseOrderID { get; set; }

        public int ItemID { get; set; }

        [StringLength(100)]
        public string ItemSize { get; set; }

        [StringLength(100)]
        public string ItemColor { get; set; }

        public decimal TotalQuantity { get; set; }

        public int ConsumptionUnitID { get; set; }

        public decimal UnitPrice { get; set; }

        public int PIId { get; set; }

        public int RevisionNo { get; set; }

        public int UserID { get; set; }

        public DateTime SetDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
