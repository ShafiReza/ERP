using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Store.ViewModels
{
    public class StockReportViewModel
    { 

        public string JobNo { get; set; }
        public string ContractNo { get; set; }
        public string PONo { get; set; }
        public string BLNo { get; set; }
        public string InvoiceNo { get; set; }
        public string StyleNo { get; set; }
        public int ItemId { get; set; }
        public string Category { get; set; }
        public string ItemDescription { get; set; }
        public string UnitName { get; set; }
        public decimal? ReceiveQuantity { get; set; }
        public decimal? IssueQuantity { get; set; }
        public decimal? CurrentStock { get; set; }
        public decimal? StockValue { get; set; }
        public decimal? ReorderPoint { get; set; }
    }
}
