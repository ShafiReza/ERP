using ScopoERP.Core.Store.ViewModels;
using System;
using System.Collections.Generic;

namespace ScopoERP.Store.ViewModel
{
    public class InventoryIssueViewModel
    {
        public int InventoryIssueID { get; set; }
        public DateTime IssuedDate { get; set; }
        public string IssuedBy { get; set; }
        public string ReceiverName { get; set; }
        public int FloorLineID { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string Remarks { get; set; }
        public short Status { get; set; }
        public string ModifiedBy { get; set; }
        public string SRNo { get; set; }
        public string PoNo { get; set; }
        public string ItemName { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public decimal? IssuedQuantity { get; set; }
        public decimal? RequestedQuantity { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }

        public List<InventoryIssueDetailsViewModel> Details { get; set; }
    }
}
