namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class bldetails
    {
        public int BLDetailsID { get; set; }

        public int BLID { get; set; }

        public int BookingID { get; set; }

        [StringLength(500)]
        public string ActualItemDescription { get; set; }

        public decimal? InvoiceQuantity { get; set; }

        public decimal? ReceivedQuantity { get; set; }

        public decimal? IssuedQuantity { get; set; }

        public int UserID { get; set; }

        public DateTime? SetupDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual bl bl { get; set; }
    }
}
