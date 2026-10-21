namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class FinancialYear
    {
        [Key]
        public int SerialNo { get; set; }

        public DateTime YearStartDate { get; set; }

        public DateTime YearEndDate { get; set; }

        public int? TransactionID { get; set; }

        public int? BookClosingAccount { get; set; }

        public decimal? BookClosingAmount { get; set; }
    }
}
