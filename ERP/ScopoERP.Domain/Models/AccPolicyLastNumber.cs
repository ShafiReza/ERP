namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class AccPolicyLastNumber
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int LastNoID { get; set; }

        [Required]
        [StringLength(150)]
        public string Description { get; set; }

        public byte GeneratedMethod { get; set; }

        public int LastIDForAutoIncrement { get; set; }

        public virtual AccSysGeneratedMethodID AccSysGeneratedMethodID { get; set; }
    }
}
