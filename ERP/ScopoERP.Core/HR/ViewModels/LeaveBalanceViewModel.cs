using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class LeaveBalanceViewModel
    {
        public int EmployeeID { get; set; }
        public string CardNo { get; set; }
        public string EmployeeName { get; set; }
        public string LeaveTypeName { get; set; }
        public int LeaveDays { get; set; }
        public int LeaveTaken { get; set; }
        public int LeaveBalance { get; set; }
    }
}
