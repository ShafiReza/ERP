using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.MaterialManagement.ViewModel
{
    public class ItemCategoryViewModel
    {
        public int ItemCategoryID { get; set; }

        [Required(ErrorMessage = "Item category name is empty")]
        public string Name { get; set; }
        public Nullable<int> ParentCategoryID { get; set; }
        public string ParentCategoryName { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }
}
