using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.OrderManagement.ViewModel
{
    public class PurchaseOrderViewModel
    {
        public int? JobID { get; set; }
        public string JobNo { get; set; }

        [Required(AllowEmptyStrings = false)]
        public int StyleID { get; set; }
        public string StyleNo { get; set; }
        public string StyleDescription { get; set; }
        public string Febrication { get; set; }
        public string HSCode { get; set; }
        public decimal? Sam { get; set; }

        public int PurchaseOrderID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string PurchaseOrderNo { get; set; }
        public string MasterPO { get; set; }

        public decimal FOB { get; set; }
        public decimal AgreedCM { get; set; }
        public int OrderQuantity { get; set; }
        public DateTime ExitDate { get; set; }
      
        public string Destination { get; set; }

        public int? ShipMode { get; set; }
        public string ShipModeName { get; set; }

        [Required(AllowEmptyStrings = false)]
        public int FactoryID { get; set; }
        public string FactoryName { get; set; }

        public decimal? SubContractRate { get; set; }
        public decimal? FactoryCM { get; set; }     

        [Required(AllowEmptyStrings = false)]
        public int SeasonID { get; set; }
        public string SeasonName { get; set; }

        [Required(AllowEmptyStrings = false)]
        public int? CurrentStatus { get; set; }

        public string Remarks { get; set; }

        public int? UnitID { get; set; }

        public string BuyerName { get; set; }
    }
}
