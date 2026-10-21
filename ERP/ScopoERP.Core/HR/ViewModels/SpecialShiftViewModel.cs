using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class SpecialShiftViewModel
    {
        public int ID { get; set; }
        public int? ShiftID { get; set; }
        public string ShiftName { get; set; }
        public DateTime? WorkingDate { get; set; }
        public DateTime? InTime { get; set; }
        public string InTimeString { get; set; }
        public DateTime? OutTime { get; set; }
        public string OutTimeString { get; set; }
        public bool? CrossesDay { get; set; }
    }
}
