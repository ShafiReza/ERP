using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class DailyEarning
    {
        public int DailyEarningID { get; set; }
        public DateTime Date { get; set; }
        public string Floor { get; set; }
        public string Line { get; set; }
        public int? StyleId { get; set; }
        public decimal? ExpectedEfficiency { get; set; }
        public decimal? ActualEarning { get; set; }
        public decimal? DailyEarningTGT { get; set; }
        public int? PurchaseOrderId { get; set; }
        public decimal CM { get; set; }
        public decimal Hour { get; set; }
        public int DirectManpower { get; set; }
        public decimal AvailableMinutes { get; set; }
        public int SewingQty { get; set; }
        public int FinishingQty { get; set; }
        public decimal CPM { get; set; }
        public string Remarks { get; set; }
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
