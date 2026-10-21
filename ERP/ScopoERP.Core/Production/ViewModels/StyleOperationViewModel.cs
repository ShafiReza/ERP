using System.Collections.Generic;

namespace ScopoERP.ProductionStatus.ViewModel
{
    public class StyleOperationViewModel
    {
        public int StyleOperationID { get; set; }
        public int StyleID { get; set; }
        public string Floor { get; set; }
        public string Line { get; set; }
        public string StyleNo { get; set; }
        public int OperationID { get; set; }
        public string OperationName { get; set; }
        public int? SpecID { get; set; }
        public string StandardOperationName { get; set; }
        public decimal? Sam { get; set; }
        public decimal? AuxSam { get; set; }
        public int? MachineID { get; set; }
        public string MachineName { get; set; }
        public int? SectionNo { get; set; }
        public decimal? NoOfWS { get; set; }
        public int? SupervisorID { get; set; }
        public string Size { get; set; }
        public string StyleOperationName { get; set; }
        public string SpecName { get; set; }
        public string SpecNo { get; set; }
        public int? Sequence { get; set; }
        public string Caption { get; set; }
        public string TopOrBottom { get; set; }
    }

    public enum KnitCriteria
    {
        Top,
        Bottom
    }
}
