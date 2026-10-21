using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class ProductionReportViewModel
    {
        public string Floor { get; set; }
        public string Line { get; set; }
        public string StyleNo { get; set; }
        public int? StyleId { get; set; }
        public int? OrderQuantity { get; set; }

        public decimal? SewingInput { get; set; }
        public decimal? Sewing { get; set; }
        public decimal? TotalSewing { get; set; }

        public decimal? Cutting { get; set; }
        public decimal? TotalCutting { get; set; }

        public decimal? SentToWash { get; set; }
        public decimal? Washing { get; set; }
        public decimal? TotalWashing { get; set; }

        public decimal? FinishingInput { get; set; }
        public decimal? Finishing { get; set; }
        public decimal? TotalFinishing { get; set; }

        public int? NoOfWS { get; set; }
        public decimal? Efficiency { get; set; }
        public decimal? Cost { get; set; }
        public decimal? CMEarnings { get; set; }
    }
}
