using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Finance.ViewModel
{
    public class RealizationViewModel
    {
        public int RealizationID { get; set; }
        public int BankForwardingID { get; set; }
        public string BankForwardingNo { get; set; }
        public string FDBPNo { get; set; }

        public decimal? RealizedValue { get; set; }
        [Column(TypeName = "date")]
        public DateTime RealizationDate { get; set; }

        public decimal? CurrencyRate { get; set; }
        public decimal? PrcValue { get; set; }

        public decimal? InvoiceValue { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
