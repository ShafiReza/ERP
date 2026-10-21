using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.ViewModels
{
    public class DailyEarningViewModel
    {
        public int DailyEarningID { get; set; }
        public DateTime Date { get; set; }
        public string Floor { get; set; }
        public string Line { get; set; }
        public int? StyleId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public string PoNo { get; set; }
        public string StyleNo { get; set; }
        public decimal? ActualEarning { get; set; }
        public decimal? DailyEarningTGT { get; set; }
        public decimal? ExpectedEfficiency { get; set; }
        public decimal? OrderQty { get; set; }
        public decimal? AgreedCM { get; set; }
        public decimal? HitRate { get; set; }
        public decimal? ProfitAndLoss { get; set; }
        public decimal? CumulativeProfitAndLoss { get; set; }
        public decimal? CumulativeProfitAndLossPercentage { get; set; }
        public decimal? CumulativeEarningTGT { get; set; }
        public decimal? CumulativeActualEarn { get; set; }
        public decimal? CumulativeProduction { get; set; }
        public decimal CM { get; set; }
        public decimal Hour { get; set; }
        public int DirectManpower { get; set; }
        public decimal AvailableMinutes { get; set; }
        public int SewingQty { get; set; }
        public decimal? SewingQtyFromHourlyEntry { get; set; }
        public decimal? ManpowerFromHourlyEntry { get; set; }
        public int FinishingQty { get; set; }
        public decimal CPM { get; set; }
        public string Remarks { get; set; }
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
