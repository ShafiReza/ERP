using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.LC.ViewModel
{
    public class BankViewModel
    {
        public int BankID { get; set; }

        [Required]
        public string BankName { get; set; }

        [Required]
        public string BankAddress { get; set; }

        public decimal? CreditLimit { get; set; }
        public decimal? AvailableCredit { get; set; }

        public string AccountNo { get; set; }

        public string SwiftCode { get; set; }

        public int UserID { get; set; }
        public DateTime SetDate { get; set; }
    }
}
