using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.OrderManagement.ViewModel
{
    public class StyleViewModel
    {
        public int StyleID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string StyleNo { get; set; }

        public string StyleDescription { get; set; }

        public int Capacity { get; set; }
        [Range(0.0, Double.MaxValue)]

        public string HSCode { get; set; }

        public Nullable<decimal> SAM { get; set; }
        public decimal? ExpectedEfficiency { get; set; }

        public string BodyStyle { get; set; }
        public string Item { get; set; }
        public string Febrication { get; set; }

        public int BuyerID { get; set; }
        public string BuyerName { get; set; }

        public int CustomerID { get; set; }
        public string CustomerName { get; set; }

        public int DivisionID { get; set; }
        public string DivisionName { get; set; }

        public int AccountID { get; set; }
        public string AccountName { get; set; }
        public string ModifiedBy { get; set; }


        public string Image { get; set; }
    }
}
