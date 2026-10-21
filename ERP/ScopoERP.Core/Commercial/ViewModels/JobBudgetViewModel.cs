using System;

namespace ScopoERP.Commercial.ViewModel
{
    public class JobBudgetViewModel
    {
        public int PurchaseOrderID { get; set; }
        public string JobNo { get; set; }
        public string ContractNo { get; set; }
        public string StyleNo { get; set; }
        public string PONo { get; set; }
        public int OrderQuantity { get; set; }
        public decimal FOB { get; set; }
        public decimal AgreedCM { get; set; }
        public decimal RMBudget { get; set; }
        public decimal TotalRMBudget { get; set; }

        public decimal? FabricsCost { get; set; }
        public decimal? TrimsCost { get; set; }
        public decimal? WashCost { get; set; }
        public decimal? TotalCost { get; set; }
    }
}
