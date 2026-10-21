using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ScopoERP.MaterialManagement.ViewModel
{
    public class PIViewModel
    {
        public int PIID { get; set; }      
        public string PINo { get; set; }
        public DateTime? PIDate { get; set; }
        public string ReferenceNo { get; set; }

        public int? SupplierID { get; set; }
        public string SupplierName { get; set; }

        public int? BackToBackLCID { get; set; }
        public string BackToBackLCNo { get; set; }

        public int? RequisitionID { get; set; }
        public string RequisitionNo { get; set; }

        public int? JobID { get; set; }
        public int? LoanFromJobID { get; set; }     

        public string OrderRefNo { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? ApproximateInhouseDate { get; set; }

        public string ModifiedBy { get; set; }
    }
}
