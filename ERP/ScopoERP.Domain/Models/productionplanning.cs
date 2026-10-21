namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("productionplanning")]
    public partial class productionplanning
    {
        [Key]
        public int PoductionPlanningID { get; set; }

        public int PoStyleID { get; set; }

        public int FloorLineID { get; set; }
        //public string Floor { get; set; }
        //public string Line { get; set; }

        //public int Quantity { get; set; }

        public int Capacity { get; set; }

        [Column(TypeName = "date")]
        public DateTime StartDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime EndDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual floorline floorline { get; set; }

        public virtual postyle postyle { get; set; }
    }
}
