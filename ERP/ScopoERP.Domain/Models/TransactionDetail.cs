namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class TransactionDetail
    {
        [Key]      
        public int TransactionDetailsID { get; set; }
        public int TransactionID { get; set; }
        public int CostCenterID { get; set; }

        public int AccountID { get; set; }

        public decimal DrCrAmount { get; set; }

        [StringLength(150)]
        public string Particular { get; set; }

        public virtual CostCenter CostCenter { get; set; }

        public virtual SubsidiaryAccount SubsidiaryAccount { get; set; }

        public virtual Transaction Transaction { get; set; }
    }
}
