using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Stackholder.ViewModel
{
    public class CustomerViewModel
    {
        public int CustomerID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string CustomerName { get; set; }
    }
}
