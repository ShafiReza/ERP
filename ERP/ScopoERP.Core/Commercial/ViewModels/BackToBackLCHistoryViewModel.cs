using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Commercial.ViewModels
{
    public class BackToBackLCHistoryViewModel
    {
        public int BackToBackLCHistoryID { get; set; }
        public int BackToBackLCID { get; set; }
        public int? PIID { get; set; }
        public decimal PIValue { get; set; }
        public int? AmendmentNo { get; set; }
        public DateTime? AmendmentDate { get; set; }
    }
}
