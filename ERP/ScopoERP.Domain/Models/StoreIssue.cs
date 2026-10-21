using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class StoreIssue
    {
        public int StoreIssueID { get; set; }
        public int PurchaseRequisitionDetailsID { get; set; }
        public string ReceiverCardNo { get; set; }
        public decimal Quantity { get; set; }
        public int PurchaseRequisitionID { get; set; }     
        public DateTime IssueDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
