using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Domain.Models
{
    public class Costsheet
    {
        public int CostsheetId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int ItemCategoryId { get; set; }
        public decimal Consumption { get; set; }
        public decimal Wastage { get; set; }
        public decimal TotalQuantity { get; set; }
        public int UnitId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
