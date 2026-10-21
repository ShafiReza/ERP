using System;

namespace ScopoERP.Core.Commercial.ViewModels
{
    public class BackToBackLCPaymentViewModel
    {
        public int BackToBackLCPaymentID { get; set; }

        public int? BackToBackLCID { get; set; }
        public string BackToBackLCNo { get; set; }
        public decimal? BackToBackLCValue { get; set; }

        public decimal? PaymentValue { get; set; }
        public DateTime? PaymentDate { get; set; }
    }
}
