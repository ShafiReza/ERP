using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class OneTimeEntryReportViewModel
    {
        public string CardNo { get; set; }
        public string NameOfEmployee { get; set; }
        public string DesignationName { get; set; }
        public DateTime? Date { get; set; }
        public string InTime { get; set; }
        public string OutTime { get; set; }
        public string Floor { get; set; }
        public DateTime? InTimeDate { get; set; }
        public DateTime? OutTimeDate { get; set; }
        public string Status { get; set; }
    }
}
