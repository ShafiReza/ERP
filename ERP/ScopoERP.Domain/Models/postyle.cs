namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("postyle")]
    public partial class postyle
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public postyle()
        {
            booking = new HashSet<booking>();
            productionplanning = new HashSet<productionplanning>();
            shipment = new HashSet<shipment>();
            sizecolor = new HashSet<sizecolor>();
        }

        public int PoStyleId { get; set; }

        public int? JobId { get; set; }

        public int StyleId { get; set; }

        [Required]
        [StringLength(100)]
        public string PoNo { get; set; }
        public string MasterPO { get; set; }

        public decimal Fob { get; set; }

        public decimal AgreedCm { get; set; }

        public int OrderQuantity { get; set; }

        public int? UnitID { get; set; }

        [Column(TypeName = "date")]
        public DateTime ExitDate { get; set; }

        public int? ShipMode { get; set; }

        [StringLength(500)]
        public string Destination { get; set; }

        [StringLength(200)]
        public string DCCode { get; set; }
        public string ReferenceNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? OriginalCRD { get; set; }

        public int FactoryId { get; set; }

        public decimal? SubContractRate { get; set; }

        public decimal? FactoryCM { get; set; }
        public decimal? Sam { get; set; }

        public int SeasonId { get; set; }

        public int? CurrentStatus { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        [StringLength(50)]
        public string CostSheetNo { get; set; }

        public decimal? WashPrice { get; set; }


        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<booking> booking { get; set; }



        public virtual factory factory { get; set; }

        public virtual jobinfo jobinfo { get; set; }

        public virtual season season { get; set; }

        public virtual styleinfo styleinfo { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<productionplanning> productionplanning { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<shipment> shipment { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<sizecolor> sizecolor { get; set; }


    }
}
