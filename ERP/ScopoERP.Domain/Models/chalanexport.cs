namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("chalanexport")]
    public partial class chalanexport
    {
        public chalanexport()
        {
            chalanexportdetails = new HashSet<chalanexportdetails>();
        }

        [Key]
        public int ChalanID { get; set; }

        [Required]
        [StringLength(100)]
        public string ChalanNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime ChalanDate { get; set; }

        [StringLength(100)]
        public string VehicleNo { get; set; }

        [StringLength(100)]
        public string DriverName { get; set; }

        [StringLength(30)]
        public string MobileNo { get; set; }

        [StringLength(100)]
        public string ShippedBy { get; set; }

        [StringLength(200)]
        public string SealNo { get; set; }

        public int? FactoryID { get; set; }

        public int UserID { get; set; }

        public DateTime SetupDate { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual factory factory { get; set; }

       
        public virtual ICollection<chalanexportdetails> chalanexportdetails { get; set; }
    }
}
