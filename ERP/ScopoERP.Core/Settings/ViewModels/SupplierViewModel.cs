using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Stackholder.ViewModel
{
    public class SupplierViewModel
    {
        public int SupplierID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string SupplierName { get; set; }

        public string Address { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
    }
}
