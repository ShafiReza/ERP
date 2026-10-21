namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Timelines
    {
        [Key]
        public int TimelineID { get; set; }
        public int PurchaseOrderId { get; set; }

        public string FabricIHDate { get; set; }
        public string DyeLotStatus { get; set; }
        public string VCodeStatus { get; set; }
        public string ShadeApprovalStatus { get; set; }
        public string JssStatus { get; set; }
        public string TrimCardSewingStatus { get; set; }
        public string TrimCardFinishingStatus { get; set; }
        public string TestReportStatus { get; set; }
        public string SewingTrimsStatus { get; set; }
        public string FinishingTrimsStatus { get; set; }
        public string ClarificationStatus { get; set; }
        public string TopSampleStatus { get; set; }
        public string Notes { get; set; }
    }
}
