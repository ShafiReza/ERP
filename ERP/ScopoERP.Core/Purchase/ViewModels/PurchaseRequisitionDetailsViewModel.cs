using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Purchase.ViewModels
{
    public class PurchaseRequisitionDetailsViewModel
    {
        public int PurchaseRequisitionDetailsID { get; set; }

        public int PurchaseRequisitionID { get; set; }

        public int ItemID { get; set; }

        public string ItemName { get; set; }

        public string ProductDescription { get; set; }

        public decimal Quantity { get; set; }

        public int UnitID { get; set; }

        public string UnitName { get; set; }

        public decimal UnitPrice { get; set; }
    }
}
