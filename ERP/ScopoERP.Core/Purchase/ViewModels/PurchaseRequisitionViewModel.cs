using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Purchase.ViewModels
{
    public class PurchaseRequisitionViewModel
    {

        public int PurchaseRequisitionID { get; set; }
        public string RequisitionNo { get; set; }
        public DateTime RequisitionDate { get; set; }

        public string Remarks { get; set; }
        public string Company { get; set; }
        public int? CompanyId { get; set; }

        public int DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public int? Status { get; set; }
        public DateTime? ApproxPaymentDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string SourceOfFund { get; set; }
        public string UserID { get; set; }

        public DateTime SetDate { get; set; }
        public DateTime? SCApproveDate { get; set; }
        public DateTime? FinanceApproveDate { get; set; }
        public  List<PurchaseRequisitionDetailsViewModel> PurchaseRequisitionDetails { get; set; }
    }
}
