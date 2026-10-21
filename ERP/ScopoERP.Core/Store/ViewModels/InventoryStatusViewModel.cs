using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Store.ViewModels
{
    public class InventoryStatusViewModel
    {
        public int? BLId { get; set; }
        public string BLNo { get; set; }

        public int? SRId { get; set; }
        public string SRNo { get; set; }

        public int? PIId { get; set; }
        public string PINo { get; set; }

        public int StyleId { get; set; }
        public string StyleNo { get; set; }

        public int PurchaseOrderId { get; set; }
        public string PONo { get; set; }

        public int ItemId { get; set; }
        public string ItemCategory { get; set; }
        public string ItemDescription { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }

        public string Unit { get; set; }

        public decimal BookingQuantity { get; set; }
        public decimal? InvoiceQuantity { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public decimal? DueQuantity { get; set; }
        public decimal? IssuedQuantity { get; set; }
        public decimal? BalanceQuantity { get; set; }
    }

    public class InventoryInViewModel
    {
        public int InventoryReceiveId { get; set; }
        public int? BLId { get; set; }
        public int? PiId { get; set; }
        public string BLNo { get; set; }
        public DateTime? BLDate { get; set; }
        public string InvoiceNo { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string ReceivedBy { get; set; }
        public DateTime? ReceivedDate { get; set; }
    }
}
