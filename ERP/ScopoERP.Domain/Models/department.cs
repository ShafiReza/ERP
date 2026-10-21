namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("department")]
    public partial class department
    {
        public int DepartmentID { get; set; }

        [Required]
        [StringLength(200)]
        public string DepartmentName { get; set; }

        public int UserID { get; set; }

        public DateTime SetupDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
