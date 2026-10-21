using System.ComponentModel.DataAnnotations;

namespace ScopoERP.ProductionStatus.ViewModel
{
    public class StandardOperationViewModel
    {
        public int OperationID { get; set; }
        [Required]
        public string OperationName { get; set; }
        [Required]
        public string OperationCodeNo { get; set; }
        public string SpecNo { get; set; }
        public int? JobClassID { get; set; }
        public string JobClassName { get; set; }
        [Required]
        public int? OperationCategoryID { get; set; }
        public string OperationCategoryName { get; set; }

        public int? MachineID { get; set; }
        public string MachineName { get; set; }
        public decimal? Sam { get; set; }
    }
}
