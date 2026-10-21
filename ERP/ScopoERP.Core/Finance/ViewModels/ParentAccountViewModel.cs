using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Core.Finance.ViewModels
{
    public class ParentAccountViewModel
    {
        public int AccountID { get; set; }

        public string AccountNo { get; set; }

        [Required(AllowEmptyStrings = false)]
        [Display(Name = "Account Name")]
        public string AccountName { get; set; }

        public string AccountType { get; set; }


        [Display(Name = "Account Type")]
        public int AccountTypeID { get; set; }
        public int? ParentID { get; set; }

        public int Status { get; set; }
        public string UserID { get; set; }
        public DateTime SetDate { get; set; }
    }
}
