namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("realization")]
    public partial class Realization
    {
        public int RealizationID { get; set; }
        public int BankForwardingID { get; set; }

        public decimal? RealizedValue { get; set; }
        [Column(TypeName = "date")]
        public DateTime RealizationDate { get; set; }

        public decimal? CurrencyRate { get; set; }
        public decimal? PrcValue { get; set; }


        [StringLength(50)]
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
