using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class LoanVIewModel
    {
        public int LoanID { get; set; }
        public decimal LoanAmount { get; set; }
        public Nullable<DateTime> DisbursementDate { get; set; }
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public int Duration { get; set; }
        public int StartsFrom { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
