using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScopoERP.Domain.Models
{
    [Table("item")]
    public partial class item
    {
        public item()
        {
            booking = new HashSet<booking>();
            initialcostsheet = new HashSet<initialcostsheet>();
        }

        public int ItemId { get; set; }

        [StringLength(100)]
        public string ItemCode { get; set; }

        public string ItemDescription { get; set; }

        public int ItemCategoryId { get; set; }

        public int? UnitId { get; set; }
        public decimal? UnitPrice { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }


        public virtual ICollection<booking> booking { get; set; }

        public virtual ICollection<initialcostsheet> initialcostsheet { get; set; }

        public virtual itemcategory itemcategory { get; set; }

    }
}
