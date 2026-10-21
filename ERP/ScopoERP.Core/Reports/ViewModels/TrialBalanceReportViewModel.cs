using System;

namespace ScopoERP.Core.ViewModels
{
    public class TrialBalanceReportViewModel
    {
        public int AccountID { get; set; }
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public decimal? Credit { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Amount { get; set; }
        public string ParentAccount { get; set; }
        public string Particular { get; set; }
        public DateTime? TransactionDate { get; set; }
        public string TransactionNo { get; set; }
        public string ParentAccountNo { get; set; }
        public string ParentAccountName { get; set; }
    }
}
