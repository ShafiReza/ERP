using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Core.Finance.ViewModels
{
    public class CostCenterViewModel
    {
        public int CostCenterID { get; set; }
        [Display(Name = "Cost Center Name")]
        public string CostCenterName { get; set; }
        public bool Status { get; set; }
        public DateTime SetupDate { get; set; }
        public string UserID { get; set; }
    }
}
