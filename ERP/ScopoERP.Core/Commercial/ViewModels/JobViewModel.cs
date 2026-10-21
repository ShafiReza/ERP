using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Commercial.ViewModel
{
    public class JobViewModel
    {
        public int JobId { get; set; }

        [Required(ErrorMessage = "Job No is empty")]
        public string JobNo { get; set; }

        [Required(ErrorMessage = "Contract No is empty")]
        public string ContractNo { get; set; }

        [Required(ErrorMessage = "Contract Date is empty")]
        public DateTime? ContractDate { get; set; }
        public string ExtraContractNo { get; set; }
        public int? BankID { get; set; }
        public string BankName { get; set; }

        public decimal? BudgetPercentage { get; set; }
        public decimal? AdvancedCMPercentage { get; set; }
        public decimal? Limit { get; set; }
        public int? SightDays { get; set; }

        public string UDNo { get; set; }
        public DateTime? UDDate { get; set; }
        public decimal? MulExportLcOrContractValue { get; set; }
        public int? MulUdGmtQuantity { get; set; }
        public int? MulTtlFabQuantity { get; set; }
        public string LastUdAm { get; set; }
        public DateTime? LastUdAmDate { get; set; }
        public decimal? LastExportLcOrContractValue { get; set; }
        public int? LastUdGmtQuantity { get; set; }
        public int? LastUdTtlFabQuantity { get; set; }     
        public DateTime? ContractLastExpiryDate { get; set; }

        public bool IsClose { get; set; }


        public string ShippedTo { get; set; }
        public string NotifyParty { get; set; }
        public string AlsoNotifyParty { get; set; }
        public string CATNO { get; set; }

        public bool? IsClosed { get; set; }
        public int? AccountID { get; set; }
       public int? CompanyID { get; set; }
        public int? BuyerID { get; set; }

        public string Buyer { get; set; }

        public string StyleNo { get; set; }

        public string PoNo { get; set; }

        public int OrderQuantity { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }
    }
}
