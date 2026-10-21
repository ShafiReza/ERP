namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("realizationaccount")]
    public partial class realizationaccount
    {
        public int RealizationAccountID { get; set; }

        [Required]
        [StringLength(200)]
        public string RealizationAccountName { get; set; }

        public int RealizationAccountType { get; set; }

        [Required]
        [StringLength(200)]
        public string RealizationAccountNo { get; set; }

        public int UserID { get; set; }

        public DateTime SetDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
