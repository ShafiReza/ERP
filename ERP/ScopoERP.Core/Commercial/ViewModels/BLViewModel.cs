using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Commercial.ViewModel
{
    public class BLViewModel
    {
        public int BLID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string BLNo { get; set; }
        public DateTime? BLDate { get; set; }

        public string InvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public DateTime? CopyDocumentReceivedDate { get; set; }
        public DateTime? OriginalDocumentReceivedDate { get; set; }
        public DateTime? DocumentSentToCNF { get; set; }
        public DateTime? GoodsDeliveryDateByCNF { get; set; }
        public DateTime? GoodsInHouseDate { get; set; }
        public decimal? AcceptanceValue { get; set; }
        public DateTime? AcceptanceDate { get; set; }

        public int? BackToBackLCID { get; set; }
        public string BackToBackLCNo { get; set; }

        public int? JobId { get; set; }
        public string JobNo { get; set; }

        public DateTime? MaturityDate { get; set; }

        public string Port { get; set; }
        public string BillEntryNo { get; set; }
        public DateTime? BillEntryDate { get; set; }

        public string BillEntryDsc { get; set; }

        public bool? IsChalan { get; set; }

        public bool Status { get; set; }
        public string PassBookNo { get; set; }
    }
}
