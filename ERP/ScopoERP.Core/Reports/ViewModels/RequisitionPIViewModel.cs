using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class RequisitionPIViewModel
    {
        public string SupplierName { get; set; }
        public string PINo { get; set; }
        public decimal? PIValue { get; set; }
        public DateTime? RequisitionDate { get; set; }

        public string LCType { get; set; }
        public string BackToBackLC { get; set; }
        public DateTime? BackToBackLCDate { get; set; }
        public decimal? BackToBackLCValue { get; set; }

        public string BookingType { get; set; }
        public string LoanFromJob { get; set; }
    }
}
