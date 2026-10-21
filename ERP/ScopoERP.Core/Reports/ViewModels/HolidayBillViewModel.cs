using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class HolidayBillViewModel
    {
        public string CardNo { get; set; }
        public string EmployeeName { get; set; }
        public string Designation { get; set; }
        public Nullable<DateTime> JoinDate { get; set; }
        public int Days { get; set; }
        public int Rate { get; set; }
        public int PaymentAmount { get; set; }
    }
}
