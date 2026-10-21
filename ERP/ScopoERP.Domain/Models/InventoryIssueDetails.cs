using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class InventoryIssueDetails
    {
        [Key]
        public int InventoryIssueDetailsID { get; set; }

        public int InventoryIssueID { get; set; }

        public int PoStyleId { get; set; }

        public decimal? IssuedQuantity { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }
        public short Status { get; set; }

        public int? ItemID { get; set; }

        public decimal? RequestedQuantity { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual InventoryIssue InventoryIssue { get; set; }
    }
}
