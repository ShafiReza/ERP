namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ContractConditions
    {
        [Key]
        public int ConditionId { get; set; }

        [Required]
        public string ConditionName { get; set; }

        public string ConditionDetails { get; set; }

        [StringLength(100)]
        public string UserName { get; set; }

        [Column(TypeName = "date")]
        public DateTime? SetDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
