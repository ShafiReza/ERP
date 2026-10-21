using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Merchant.ViewModels
{
    public class ExcessBookingViewModel
    {
        public int ExcessBookingID { get; set; }

        public int JobID { get; set; }
        public string JobNo { get; set; }

        public int ProformaInvoiceID { get; set; }
        public string PINo { get; set; }

        public int ItemID { get; set; }

  
        public string ItemColor { get; set; }
        public string ItemName { get; set; }


        public string ItemSize { get; set; }

        public decimal TotalQuantity { get; set; }

        public decimal TotalPrice { get; set; }
    }
}
