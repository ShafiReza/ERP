namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("pocostsheet")]
    public partial class pocostsheet
    {
        public int PoCostSheetID { get; set; }

        public int PoStyleId { get; set; }

        [Required]
        [StringLength(50)]
        public string CostSheetNo { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
