using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.ViewModels
{
    public class FloorLineProductionReportViewModel
    {
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
        public decimal? ActualWorkHrs { get; set; }
        public decimal? ProductionTGT { get; set; }
        public int? DayProduction { get; set; }
        public decimal? ProducedHrs { get; set; }
        public double? AvgWorkHrs { get; set; }
        public decimal? DayCMEarning { get; set; }
        public int? RunDays { get; set; }
        public decimal? DayEfficency { get; set; }
        public double? DayPerformance { get; set; }
        public double? DayExpCMEarning { get; set; }
        public decimal? PlanCMTarget { get; set; }
        public int? MTDProduction { get; set; }
        public double? MTDDayEfficency { get; set; }
        public double? MTDProducedHrs { get; set; }
        public double? MTDWorkHrs { get; set; }
        public decimal? MTDDayCMEarning { get; set; }
        public double? MTDAvgWorkHrs { get; set; }
        public decimal? MTDCMTarget { get; set; }
        public int? MTDManpower { get; set; }
    }
}
