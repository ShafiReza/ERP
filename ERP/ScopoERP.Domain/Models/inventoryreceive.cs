namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("inventoryreceive")]
    public partial class InventoryReceive
    {
        public int InventoryReceiveID { get; set; }
        public int PiID { get; set; }
        public int? PurchaseOrderID { get; set; }
        public int? UnitID { get; set; }
        public int ItemID { get; set; }
        public string ItemCode { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }
        public int BLID { get; set; }
        public decimal? InvoiceQuantity { get; set; }
        public decimal ReceivedQuantity { get; set; }
        public string ReceivedBy { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
     
    }
}
