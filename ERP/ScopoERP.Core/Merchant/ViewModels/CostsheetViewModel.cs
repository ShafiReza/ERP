using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.MaterialManagement.ViewModel
{
    public class CostsheetViewModel
    {
        public int CostSheetId { get; set; }
        public int PurchaseOrderId { get; set; }
        public int ItemCategoryId { get; set; }
        public decimal Consumption { get; set; }
        public decimal Wastage { get; set; }
        public decimal TotalQuantity { get; set; }
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
