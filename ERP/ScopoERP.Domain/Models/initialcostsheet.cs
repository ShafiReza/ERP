namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("initialcostsheet")]
    public partial class initialcostsheet
    {
        public int InitialCostsheetId { get; set; }

        public int StyleId { get; set; }

        [StringLength(50)]
        public string CostSheetNo { get; set; }

        public int ItemCategoryId { get; set; }

        public int ItemId { get; set; }

        public decimal Consumption { get; set; }

        public int ConsumptionUnitId { get; set; }

        public decimal Wastage { get; set; }

        public decimal ActualPrice { get; set; }

        public decimal OfferToBuyer { get; set; }

        public int? SupplierID { get; set; }

        public int? Priority { get; set; }

        public decimal? ConversionQuantity { get; set; }

        public int ConversionUnit { get; set; }

        public decimal ActualConsumption { get; set; }

        public decimal? TotalRawMaterials { get; set; }

        public decimal? TotalCost { get; set; }

        public int Status { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public virtual consumptionunit consumptionunit { get; set; }

        public virtual consumptionunit consumptionunit1 { get; set; }

        public virtual item item { get; set; }

        public virtual itemcategory itemcategory { get; set; }

        public virtual styleinfo styleinfo { get; set; }

        public virtual supplier supplier { get; set; }
    }
}
