using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Production.ViewModel
{
    public class ProductionFloorViewModel
    {
        public int ProductionFloorID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Floor { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string Line { get; set; }

        public string Division { get; set; }
        public int Status { get; set; }
    }
}
