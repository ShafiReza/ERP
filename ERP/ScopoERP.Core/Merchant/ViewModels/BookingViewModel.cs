using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.MaterialManagement.ViewModel
{
    public class BookingViewModel
    {
        public int BookingID { get; set; }
        public int? PIId { get; set; }
        public int PurchaseOrderID { get; set; }

        public string PONo { get; set; }
        public string StyleNo { get; set; }

        public int ItemID { get; set; }
        public string ItemDescription { get; set; }
        public int ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public string ItemSize { get; set; }
        public string ItemColor { get; set; }
        public string ItemCode { get; set; }

        public decimal TotalQuantity { get; set; }
        public int UnitID { get; set; }
        public string UnitName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }

        public int RevisionNo { get; set; }
        public string ModifiedBy { get; set; }
    }

    public class BookingEntryViewModel
    {
        public PIViewModel PI { get; set; }
        public List<BookingViewModel> Bookings { get; set; }
    }
}
