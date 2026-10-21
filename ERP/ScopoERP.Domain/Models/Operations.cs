namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Operations
    {
      


        [Key]
        public int OperationID { get; set; }

        public string OperationName { get; set; }

        public string OperationCodeNo { get; set; }

        public int? OperationCategoryID { get; set; }

        public int? JobClassID { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public int? MachineID { get; set; }
        public decimal? Sam { get; set; }



        public virtual JobClasses JobClasses { get; set; }

        public virtual OperationCategories OperationCategories { get; set; }
    }
}
