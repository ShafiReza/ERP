using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Core.Finance.ViewModels
{
    public class SubsidiaryAccountViewModel
    {
        public int AccountID { get; set; }
        public string AccountNo { get; set; }

        [Display(Name = "Account Name")]
        [Required(AllowEmptyStrings = false)]
        public string AccountName { get; set; }
        public string AccountType { get; set; }
        public int AccountTypeID { get; set; }

        [Display(Name = "Parent")]
        public int? ParentID { get; set; }
        public string ParentAccountName { get; set; }

        [Display(Name = "Parent Account No")]
        public string ParentAccountNo { get; set; }
        public int BranchID { get; set; }

        public int Status { get; set; }
        public string UserID { get; set; }
        public Nullable<DateTime> CreationDate { get; set; }
        public Nullable<DateTime> ClosingDate { get; set; }

        [Display(Name = "Is Auto Entry")]
        public bool IsAutoEntry { get; set; }

        [Display(Name = "Branch Type Wise Account")]
        public int BranchTypeWiseAccountID { get; set; }

        [Display(Name = "Cash Flow")]
        public int CashFlowID { get; set; }

        [Display(Name = "Account Identity No")]
        public int AccountIdentityNo { get; set; }


    }
}
