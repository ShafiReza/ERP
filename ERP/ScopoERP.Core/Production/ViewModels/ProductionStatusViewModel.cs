using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.ViewModels
{
    public class ProductionStatusViewModel
    {
        public int? SpecId { get; set; }
        public string SpecNo { get; set; }
        public int? MachineID { get; set; }
        public string MachineName { get; set; }
        public int? Section { get; set; }
        public decimal? Sam { get; set; }
        public string CardNo { get; set; }
        public int? Output { get; set; }
        public int? DownTime { get; set; }
        public int? Sequence { get; set; }

        public decimal? NoOfWS { get; set; }
        public int? CheckQty { get; set; }
        public string DefectCodes { get; set; }
    }
}
