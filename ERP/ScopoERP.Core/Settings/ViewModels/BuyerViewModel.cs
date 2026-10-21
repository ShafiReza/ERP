using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Stackholder.ViewModel
{
    public class BuyerViewModel
    {
        public int BuyerID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string BuyerName { get; set; }
        public string BuyerAddress { get; set;}

        
    }
}
