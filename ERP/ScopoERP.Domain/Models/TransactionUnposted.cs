namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TransactionUnposted
    {       
        public TransactionUnposted()
        {
            TransactionUnpostedDetails = new HashSet<TransactionUnpostedDetail>();
        }

        [Key]
        public int TransactionID { get; set; }

        public DateTime EntryDate { get; set; }

        public DateTime? ValueDate { get; set; }

        public int BranchID { get; set; }
        public int? PurchaseRequisitionID { get; set; }

        [StringLength(250)]
        public string GeneralParticular { get; set; }

        [Required]
        [StringLength(50)]
        public string UserID { get; set; }

        public int? VoucherTypeID { get; set; }

        public virtual ICollection<TransactionUnpostedDetail> TransactionUnpostedDetails { get; set; }
    }
}
