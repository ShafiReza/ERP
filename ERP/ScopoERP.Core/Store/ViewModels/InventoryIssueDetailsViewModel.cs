using System;

namespace ScopoERP.Core.Store.ViewModels
{
    public class InventoryIssueDetailsViewModel
    {
        public int InventoryIssueDetailsID { get; set; }

        public int InventoryIssueID { get; set; }

        public int PoStyleId { get; set; }
        public string PoNo { get; set; }

        public decimal? IssuedQuantity { get; set; }
        public decimal? ReceivedQuantity { get; set; }

        public decimal? StockQuantity { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }

        public short Status { get; set; }

        public int? ItemID { get; set; }
        public string ItemName { get; set; }

        public int? ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }

        public int? UnitID { get; set; }
        public string UnitName { get; set; }

        public decimal? RequestedQuantity { get; set; }
        public decimal? TotalReceived { get; set; }
        public decimal? TotalIssued { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
