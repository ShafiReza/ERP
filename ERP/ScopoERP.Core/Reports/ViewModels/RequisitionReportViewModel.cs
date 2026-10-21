using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class RequisitionReportViewModel
    {
        public int JobID { get; set; }
        public string JobNo { get; set; }
        public string ContractNo { get; set; }
        public decimal? ContractValue { get; set; }
        public decimal? BudgetValue { get; set; }
        public decimal? AgreedCM { get; set; }
        public decimal? BackToBackLCValue { get; set; }
        public decimal? PendingB2BLCValue { get; set; }
        public decimal? AppliedForB2BLCValue { get; set; }
        public decimal? TotalValue { get; set; }
        public decimal? AvailableBudget { get; set; }
        public string RequisitionNo { get; set; }
        public int? RequisitionSLNo { get; set; }
        public DateTime? RequisitionDate { get; set; }
        public int OrderQuantity { get; set; }

        public DateTime? FirstShipmentDate { get; set; }
        public DateTime? LastShipmentDate { get; set; }

        public decimal? CPM { get; set; }
        public decimal? AvailableMinutes { get; set; }
        public decimal? ActualCM { get; set; }
        public decimal? Ratio { get; set; }

        public List<RequisitionPIViewModel> AppliedForB2BList { get; set; }
        public List<RequisitionPIViewModel> PendingForB2BList { get; set; }
        public List<RequisitionPIViewModel> AlreadyOpenedB2BList { get; set; }
        public List<RequisitionPO> RequisitionPOList { get; set; }
    }
}
