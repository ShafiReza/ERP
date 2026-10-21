
namespace ScopoERP.ProductionStatus.ViewModel
{
    public class CapacityPlanningViewModel
    {         
        public int? Year { get; set; }
        public int? Month { get; set; }
        public int FactoryId { get; set; }
        public string FactoryName { get; set; }
        public int? OrderQuantity { get; set; }
        public decimal? TotalCM { get; set; }
        public decimal? RequiredMinutes { get; set; }
        public int? Worker { get; set; }
        public int? WorkDays { get; set; }     
        public decimal? WorkHours { get; set; }     
        public decimal? Absenteeism { get; set; }
        public decimal? Efficiency { get; set; }
        public decimal? Load { get; set; }
        public decimal? AvailableMinutes { get; set; }
        public int? QuantityLoad { get; set; }
        public decimal? MinutesLoad { get; set; }
        public string YearName { get; set; }
        public decimal? ApproxQty { get; set; }
    }
}
