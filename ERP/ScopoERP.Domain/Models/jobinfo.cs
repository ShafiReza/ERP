namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("jobinfo")]
    public partial class jobinfo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public jobinfo()
        {
            backtobacklc = new HashSet<backtobacklc>();
            excessbooking = new HashSet<excessbooking>();
            piinfo = new HashSet<piinfo>();
            postyle = new HashSet<postyle>();
            requisition = new HashSet<requisition>();
        }

        public int JobInfoId { get; set; }

        [StringLength(30)]
        public string JobNo { get; set; }

        [Required]
        [StringLength(250)]
        public string ContractNo { get; set; }

        [StringLength(250)]
        public string ExtraContractNo { get; set; }

        public int? BankID { get; set; }

        public decimal? AdvancedCMPercentage { get; set; }

        public int? SightDays { get; set; }

        [StringLength(50)]
        public string UDNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? UDDate { get; set; }

        public DateTime? ContractDate { get; set; }

        public string ShippedTo { get; set; }

        public string notifyParty { get; set; }

        public string AlsoNotifyParty { get; set; }

        public string CATNO { get; set; }

        public bool? IsClosed { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public int? BuyerID { get; set; }

        public DateTime? ContractLastExpiryDate { get; set; }

        public int? AccountId { get; set; }

        public int? CompanyID { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<backtobacklc> backtobacklc { get; set; }

        public virtual bank bank { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<excessbooking> excessbooking { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<piinfo> piinfo { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<postyle> postyle { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<requisition> requisition { get; set; }
    }
}
