using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Common.ViewModel
{
    public class FactoryViewModel
    {
        public int FactoryID { get; set; }

        [Required(ErrorMessage = "Factory is empty")]
        public string FactoryName { get; set; }
        public decimal? CMP { get; set; }
        public int? EmployeeNumber { get; set; }
    }
}
