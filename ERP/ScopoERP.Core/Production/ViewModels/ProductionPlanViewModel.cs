using System;


namespace ScopoERP.ProductionStatus.ViewModel
{
    public class ProductionPlanViewModel
    {
        public int id { get; set; }
        public int resourceId { get; set; }
        public int purchaseOrderId { get; set; }
        public string title { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }
}
