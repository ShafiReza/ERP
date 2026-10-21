namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("requisition")]
    public partial class requisition
    {
        public int RequisitionID { get; set; }

        [Required]
        [StringLength(20)]
        public string RequisitionNo { get; set; }

        public int? RequisitionSerial { get; set; }

        [Column(TypeName = "date")]
        public DateTime? RequisitionDate { get; set; }

        public int JobID { get; set; }

        public int SupplierID { get; set; }

        public int AccountID { get; set; }

        public bool Status { get; set; }

        public int UserID { get; set; }

        public DateTime SetupDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual account account { get; set; }

        public virtual jobinfo jobinfo { get; set; }
    }
}
