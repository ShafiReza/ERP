using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class LeaveApplicationViewModel
    {
        public int LeaveApplicationID { get; set; }
        public int LeaveTypeID { get; set; }
        public string LeaveTypeName { get; set; }
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }

        public string EmployeeCardNo { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Status { get; set; }
        public string ApproavedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string ReasonOfLeave { get; set; }
        public DateTime? SubstituteDate { get; set; }
    }
}
