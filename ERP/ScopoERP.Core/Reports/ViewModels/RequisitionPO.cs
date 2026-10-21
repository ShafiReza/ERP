using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class RequisitionPO
    {
        public string PONo { get; set; }
        public DateTime? ExitDate { get; set; }
        public decimal? TotalFOB { get; set; }
        public decimal? TotalBudget { get; set; }
        public decimal? TotalB2BLCValue { get; set; }
    }
}
