namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("styleinfo")]
    public partial class styleinfo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public styleinfo()
        {
            initialcostsheet = new HashSet<initialcostsheet>();
            postyle = new HashSet<postyle>();
        }

        [Key]
        public int StyleId { get; set; }

        [Required]
        [StringLength(100)]
        public string StyleNo { get; set; }

        [StringLength(200)]
        public string StyleDescription { get; set; }

        public int Capacity { get; set; }

        public decimal? Sam { get; set; }
        public decimal? ExpectedEfficiency { get; set; }

        [StringLength(200)]
        public string BodyStyle { get; set; }

        [StringLength(200)]
        public string Item { get; set; }

        [StringLength(200)]
        public string Febrication { get; set; }

        [StringLength(150)]
        public string HSCode { get; set; }

        public int BuyerId { get; set; }

        public int CustomerId { get; set; }

        public int DevisionId { get; set; }

        public int AccountId { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual account account { get; set; }

  

        public virtual buyerinfo buyerinfo { get; set; }

        public virtual customerinfo customerinfo { get; set; }

        public virtual devision devision { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<initialcostsheet> initialcostsheet { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<postyle> postyle { get; set; }
    }
}
