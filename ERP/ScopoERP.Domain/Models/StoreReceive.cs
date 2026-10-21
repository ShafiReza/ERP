using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class StoreReceive
    {
        public int StoreReceiveID { get; set; }
        public int PurchaseRequisitionID { get; set; }
        public int PurchaseRequisitionDetailsID { get; set; }
        public string ReferenceNo { get; set; }
        public DateTime ReceivedDate { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
