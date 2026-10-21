namespace ScopoERP.Core.ViewModels
{
    public class BalanceSheetReportViewModel
    {
        public int AccountID { get; set; }
        public string ParentAccount { get; set; }
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public decimal? Amount { get; set; }
        public byte Type { get; set; }
    }
}
