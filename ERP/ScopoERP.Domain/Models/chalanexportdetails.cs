using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class chalanexportdetails
    {
        public int ChalanexportdetailsID { get; set; }

        public int PurchaseOrderID { get; set; }

        public int? ChalanID { get; set; }

        public int ChalanQuantity { get; set; }

        public decimal? CBM { get; set; }

        public decimal? CartoonQuantity { get; set; }

        public DateTime? ChalanDate { get; set; }

        public int? InvoiceID { get; set; }

        public decimal? InvoiceFOB { get; set; }
      
        public string Destination { get; set; }

        public int UserID { get; set; }

        public DateTime SetupDate { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual chalanexport chalanexport { get; set; }

    }
}
