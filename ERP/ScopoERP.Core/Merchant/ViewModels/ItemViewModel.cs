using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.MaterialManagement.ViewModel
{
    public class ItemViewModel
    {
        public int ItemID { get; set; }
        public string ItemCode { get; set; }

        [Required(ErrorMessage = "Item Description is empty")]
        public string ItemDescription { get; set; }

        public int ItemCategoryID { get; set; }
        public string ItemCategoryName { get; set; }

        public int? UnitId { get; set; }
        public string UnitName { get; set; }

        public decimal? UnitPrice { get; set; }

        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
