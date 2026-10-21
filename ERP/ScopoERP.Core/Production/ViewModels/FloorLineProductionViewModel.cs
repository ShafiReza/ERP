using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.ViewModels
{
    public class FloorLineProductionViewModel
    {
        public int ID { get; set; }
        public string Floor { get; set; }
        public string Line { get; set; }
        public DateTime ProductionDate { get; set; }
        public int StyleId { get; set; }
        public string StyleNo { get; set; }
        public decimal SAM { get; set; }
        public decimal CM { get; set; }
        public DateTime? StyleStartDate { get; set; }
        public int? DirectManPower { get; set; }
        public int? TargetEfficencyInPercentage { get; set; }
        public int? ForecastSAH { get; set; }
        public int? TotalWorkHrs { get; set; }
        public int? ProductionTGT { get; set; }
        public int? DayProduction { get; set; }
        public double? ProducedHrs { get; set; }
        public double? DayCMEarning { get; set; }
        public decimal? ActualWorkHrs { get; set; }
    }
}
