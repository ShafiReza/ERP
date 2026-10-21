namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Company")]
    public partial class Company
    {
        public int CompanyID { get; set; }

        [Required]
        [StringLength(250)]
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyTelephone { get; set; }

        public decimal CPM { get; set; }
    }
}
