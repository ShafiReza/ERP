namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("bankforwarding")]
    public partial class bankforwarding
    {
        public int BankForwardingID { get; set; }

        [Required]
        [StringLength(20)]
        public string BankForwardingNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime BankForwardingDate { get; set; }

        [StringLength(100)]
        public string FDBPNo { get; set; }

        public int JobID { get; set; }

        public bool Status { get; set; }

        public int UserID { get; set; }

        public DateTime SetupDate { get; set; }

        [StringLength(100)]
        public string Courier { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
