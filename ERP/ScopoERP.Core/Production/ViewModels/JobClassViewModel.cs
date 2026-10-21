namespace ScopoERP.ProductionStatus.ViewModel
{
    public class JobClassViewModel
    {
        public int JobClassID { get; set; }
        public string JobClassName { get; set; }
        public decimal BaseRate { get; set; }
        public decimal? MaxPaid { get; set; }
    }
}
