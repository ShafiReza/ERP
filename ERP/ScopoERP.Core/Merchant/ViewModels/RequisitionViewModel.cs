using ScopoERP.Commercial.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Merchant.ViewModels
{
    public class RequisitionViewModel
    {
        public int RequisitionID { get; set; }
        public string RequisitionNo { get; set; }
        public int? RequisitionSerial { get; set; }
        public DateTime? RequisitionDate { get; set; }

        public int JobID { get; set; }
        public string JobNo { get; set; }

        public int SupplierID { get; set; }
        public string SupplierName { get; set; }

        public int AccountID { get; set; }

        public int Status { get; set; }
        public int UserID { get; set; }
        public DateTime SetupDate { get; set; }

        public List<PISummary> PIList { get; set; }
    }
}
