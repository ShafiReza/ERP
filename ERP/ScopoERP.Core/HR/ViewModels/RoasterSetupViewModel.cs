using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class RoasterSetupViewModel
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string CardNo { get; set; }
        public string EmployeeName { get; set; }
        public string ShiftName { get; set; }
        public int? ShiftId { get; set; }
        public int? RoasterId { get; set; }
        public DateTime? WorkingDate { get; set; }
    }
}
