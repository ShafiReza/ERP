using System;

namespace ScopoERP.Store.ViewModel
{
    public class InventoryReceiveViewModel
    {
        public int InventoryReceiveID { get; set; }
        public int PiID { get; set; }
        public int? PurchaseOrderID { get; set; }
        public int? UnitID { get; set; }
        public string PINo { get; set; }
        public int ItemID { get; set; }
        public string ItemName { get; set; }
        public string ItemCode { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }

        public int? ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public string InvoiceNo { get; set; }  
        public decimal? InvoiceQuantity { get; set; }
        public decimal? ReceivedQuantity { get; set; }
        public decimal? BalanceQuantity { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }

        public int BLDetailsID { get; set; }
        public int BLID { get; set; }
        public int BookingID { get; set; }        
        public int UserID { get; set; }
        public DateTime? SetupDate { get; set; }

        public string PONo { get; set; }
        public string ItemDescription { get; set; }      
        public decimal BookingQuantity { get; set; }

        public decimal? TotalReceived { get; set; }
        public decimal? TotalIssued { get; set; }
        public decimal? CurrentStock { get; set; }
        public string UnitName { get; set; }
        public DateTime? ReceivedDate { get; set; }
    }
}
