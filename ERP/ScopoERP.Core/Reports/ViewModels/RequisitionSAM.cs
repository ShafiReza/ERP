using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class RequisitionSAM
    {
        public decimal? CPM { get; set; }
        public decimal? AvailableMinutes { get; set; }
        public decimal? ActualCM { get; set; }
        public decimal? Ratio { get; set; }
    }
}
