using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class SalarySummaryViewModel
    {
        public string Floor { get; set; }
        public int? Worker { get; set; }
        public int? Staff { get; set; }
        public decimal? PayableAmount { get; set; }
        public decimal? OTAmount { get; set; }
        public decimal? ExtraOT { get; set; }
        public int? TiffinBill { get; set; }
        public decimal? NightBill { get; set; }
        public decimal? HolidayBill { get; set; }
        public double? ELAmount { get; set; }

        public int TotalPD { get; set; }
        public decimal? TotalSalary { get; set; }
    }
}
