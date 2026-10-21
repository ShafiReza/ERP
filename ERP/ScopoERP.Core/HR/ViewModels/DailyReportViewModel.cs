using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class DailyReportViewModel
    {
        public string OriginalCardNo { get; set; }
        public string CardNo { get; set; }
        public int? DesignationID { get; set; }
        public int? DepartmentID { get; set; }
        public string DesignationName { get; set; }
        public string DepartmentName { get; set; }
        public string EmployeeName { get; set; }
        public int? EmployeeID { get; set; }
        public int? EmployeeTypeID { get; set; }
        public string CumulativeHour { get; set; }
        public string InTime { get; set; }
        public string OutTime { get; set; }
        public int? TotalMinutes { get; set; }
        public int? LunchTime { get; set; }
        public DateTime? Date { get; set; }
        public string Status { get; set; }
        public int? LateMinutes { get; set; }
        public int? OTMinutes { get; set; }

    }
}
