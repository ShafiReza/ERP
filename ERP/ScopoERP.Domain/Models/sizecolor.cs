namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("sizecolor")]
    public partial class sizecolor
    {
        public int SizeColorId { get; set; }

        public int PoStyleId { get; set; }

        [Required]
        [StringLength(45)]
        public string Size { get; set; }

        [Required]
        [StringLength(45)]
        public string Color { get; set; }

        public int Quantity { get; set; }

        public decimal? FOB { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual postyle postyle { get; set; }
    }
}
