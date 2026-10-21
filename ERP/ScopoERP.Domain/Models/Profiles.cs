namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Profiles
    {
        [Key]
        public Guid UserId { get; set; }

        [Required]
        public string PropertyNames { get; set; }

        [Required]
        public string PropertyValueStrings { get; set; }

        [Required]
        public byte[] PropertyValueBinary { get; set; }

        public DateTime LastUpdatedDate { get; set; }

        public virtual Users Users { get; set; }
    }
}
