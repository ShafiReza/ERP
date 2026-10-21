namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("BackToBackLCPayment")]
    public partial class BackToBackLCPayment
    {
        public int BackToBackLCPaymentID { get; set; }

        public int? BackToBackLCID { get; set; }
        public int? BLID { get; set; }

        public decimal? PaymentValue { get; set; }

        [Column(TypeName = "date")]
        public DateTime? PaymentDate { get; set; }

        [StringLength(50)]
        public string CreatedBy { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
      
    }
}
