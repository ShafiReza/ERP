namespace ScopoERP.OrderManagement.ViewModel
{
    public class SizeColorViewModel
    {
        public int PurchaseOrderId { get; set; }

        public string Color { get; set; }

        public string Size { get; set; }

        public int Quantity { get; set; }
        public decimal? FOB { get; set; }
    }
}
