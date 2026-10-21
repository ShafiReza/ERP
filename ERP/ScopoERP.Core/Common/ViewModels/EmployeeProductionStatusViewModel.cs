using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Common.ViewModels
{
    public class EmployeeProductionStatusViewModel
    {
        public string CardNo { get; set; }
        public string EmployeeName { get; set; }
        public int TotalProduction { get; set; }
        public List<OutputByDateViewModel> Performances { get; set; }
    }

    public class OutputByDateViewModel
    {
        public DateTime Date { get; set; }
        public int Output { get; set; }
    }
}
