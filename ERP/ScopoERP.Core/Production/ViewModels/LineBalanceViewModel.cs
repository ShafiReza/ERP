using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.ViewModels
{
    public class LineBalanceViewModel
    {
        public int? Sequence { get; set; }
        public string Section { get; set; }
        public string OpeartionNo { get; set; }
        public int? Output { get; set; }
        public int? DownTime { get; set; }
        public decimal? Sam { get; set; }
        public int NoOfWS { get; set; }
        public int? Target { get; set; }

        public decimal? MaxLoad { get; set; }
        public decimal? PitchTime { get; set; }
        public decimal? Efficiency { get; set; }
    }
}
