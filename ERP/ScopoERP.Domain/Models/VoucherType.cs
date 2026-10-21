namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("VoucherType")]
    public partial class VoucherType
    {


        public int VoucherTypeID { get; set; }

        [StringLength(50)]
        public string VoucherTypeName { get; set; }

    
    }
}
