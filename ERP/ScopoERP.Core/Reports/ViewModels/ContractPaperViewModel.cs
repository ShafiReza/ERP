using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class ContractPaperViewModel
    {
        public int PurchaseOrderID { get; set; }
        public string StyleNo { get; set; }
        public string StyleDescription { get; set; }
        public string PONo { get; set; }
        public string Item { get; set; }
        public int OrderQuantity { get; set; }
        public decimal FOB { get; set; }
        public decimal TotalFOB { get; set; }
        public DateTime ExitDate { get; set; }
        public decimal? FactoryCM { get; set; }
        public string HSCode { get; set; }
        public string Febrication { get; set; }
    }
}
