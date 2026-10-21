namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class PurchaseRequisitionDetail
    {
        [Key]
        public int PurchaseRequisitionDetailsID { get; set; }

        public int PurchaseRequisitionID { get; set; }

        public int ItemID { get; set; }

        [StringLength(500)]
        public string ProductDescription { get; set; }

        public decimal Quantity { get; set; }

        public int UnitID { get; set; }

        public decimal UnitPrice { get; set; }
       

        public virtual PurchaseRequisition PurchaseRequisition { get; set; }
    }
}
