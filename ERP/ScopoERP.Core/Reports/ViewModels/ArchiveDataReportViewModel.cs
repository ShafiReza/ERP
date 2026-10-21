using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class ArchiveDataReportViewModel
    {
        public string Factory { get; set; }
        public DateTime Date { get; set; }
        public int NoOfEmployees { get; set; }
        public decimal TotalHours { get; set; }
        public decimal AvgHours { get; set; }
    }
}
