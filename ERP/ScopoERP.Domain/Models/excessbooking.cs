namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("excessbooking")]
    public partial class excessbooking
    {
        public int ExcessBookingID { get; set; }

        public int JobID { get; set; }

        public int ProformaInvoiceID { get; set; }

        public int ItemID { get; set; }

        [StringLength(200)]
        public string ItemColor { get; set; }

        [StringLength(200)]
        public string ItemSize { get; set; }

        public decimal TotalQuantity { get; set; }

        public decimal TotalPrice { get; set; }

        public bool Status { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual piinfo piinfo { get; set; }

        public virtual jobinfo jobinfo { get; set; }
    }
}
