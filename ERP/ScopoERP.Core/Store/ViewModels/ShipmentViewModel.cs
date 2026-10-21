using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Store.ViewModel
{
    public class ShipmentViewModel
    {
        public int ShipmentID { get; set; }

        public int PurchaseOrderID { get; set; }
        public string PONo { get; set; }

        public string StyleNo { get; set; }
        public int OrderQuantity { get; set; }

        public int? ChalanID { get; set; }
        public string ChalanNo { get; set; }
        public DateTime? ChalanDate { get; set; }

        [Required]
        public int ChalanQuantity { get; set; }

        public decimal? CBM { get; set; }
        public decimal? CartoonQuantity { get; set; }
        public decimal? GrossWeight { get; set; }
        public decimal? NetWeight { get; set; }

        public string FactoryName { get; set; }
        public string Floor { get; set; }

        public int? InvoiceID { get; set; }
        public string InvoiceNo { get; set; }
        public decimal? InvoiceFOB { get; set; }
        public string Destination { get; set; }

        public decimal? ShippedFOB { get; set; }
        public decimal? TotalFOB { get; set; }

        public decimal? FOB { get; set; }

        public int UserID { get; set; }
        public DateTime SetupDate { get; set; }
    }
}
