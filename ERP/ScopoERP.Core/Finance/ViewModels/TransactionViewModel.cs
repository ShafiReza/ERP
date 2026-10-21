using System;
using System.Collections.Generic;
using System.Reflection;

namespace ScopoERP.Core.Finance.ViewModels
{
    public class TransactionViewModel
    {
        public int TransactionID { get; set; }
        public string TransactionNo { get; set; }
        public DateTime EntryDate { get; set; }
        public string GeneralParticular { get; set; }
        public int CostCenterID { get; set; }
        public int BranchID { get; set; }
        public int? VoucherTypeID { get; set; }
        public DateTime? ValueDate { get; set; }
        public int? PurchaseRequisitionID { get; set; }
        public string CreatedBy { get; set; }

        public decimal DrCrAmount { get; set; }

        public IEnumerable<TransactionDetailViewModel> TransactionDetailList { get; set; }
    }

    public class TransactionDetailViewModel
    {
        public int TransactionDetailID { get; set; }
        public int TransactionID { get; set; }
        public int SerialNo { get; set; }
        public int AccountID { get; set; }
        public string AccountNo { get; set; }
        public string AccountName { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public decimal Amount { get; set; }
        public string Particulars { get; set; }
        public int CostCenterID { get; set; }
    }
}
