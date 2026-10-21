using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class InventoryIssue
    {
        public InventoryIssue()
        {
            InventoryIssueDetails = new HashSet<InventoryIssueDetails>();

        }
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
        public DateTime? LastModifiedDate { get; set; }
        public string SRNo { get; set; }

        public virtual ICollection<InventoryIssueDetails> InventoryIssueDetails { get; set; }
    }
}
