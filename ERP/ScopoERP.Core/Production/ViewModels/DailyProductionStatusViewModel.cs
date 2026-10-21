using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Production.ViewModel
{
    public class DailyProductionStatusViewModel
    {
        public int Id { get; set; }
        public DateTime ProductionDate { get; set; }
        public int? Hour { get; set; }
        [Required]
        public string Floor { get; set; }
        [Required]
        public string Line { get; set; }

        public string BuyerName { get; set; }
        public int StyleID { get; set; }
        public string StyleNo { get; set; }
        public decimal SAM { get; set; }

        public int PurchaseOrderID { get; set; }
        public string PurchaseOrderNo { get; set; }

        public int OrderQuantity { get; set; }
        public decimal? AgreedCM { get; set; }
        public DateTime ExitDate { get; set; }

        public decimal? Cutting { get; set; }
        public decimal? TotalCutting { get; set; }
        public decimal? CuttingBalance { get; set; }

        public decimal? Sewing { get; set; }
        public decimal? TotalSewing { get; set; }
        public decimal? SewingBalance { get; set; }

        public decimal? Washing { get; set; }
        public decimal? TotalWashing { get; set; }
        public decimal? WashingBalance { get; set; }

        public decimal? Printing { get; set; }
        public decimal? TotalPrinting { get; set; }
        public decimal? PrintingBalance { get; set; }

        public decimal? Finishing { get; set; }
        public decimal? TotalFinishing { get; set; }
        public decimal? FinishingBalance { get; set; }

        public decimal? ProduceMinutes { get; set; }
        public decimal? CMEarnings { get; set; }

        public DateTime? SewingStartDate { get; set; }
        public DateTime? SewingEndDate { get; set; }

        public int? RunningMachine { get; set; }

        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public string Color { get; set; }
        public decimal? SewingInput { get; set; }
        public decimal? SentToWash { get; set; }
        public decimal? FinishingInput { get; set; }
    }
}
