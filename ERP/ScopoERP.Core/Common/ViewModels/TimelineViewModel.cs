using System;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Common.ViewModel
{
    public class TimelineViewModel
    {
        public int PurchaseOrderId { get; set; }
        public string PONo { get; set; }
        public string StyleNo { get; set; }
        public int OrderQuantity { get; set; }
        public DateTime ExitDate { get; set; }
        public string StyleDescription { get; set; }
        public string FactoryName { get; set; }

        public DateTime? FabricDueDate { get; set; }
        public string FabricIHDate { get; set; }

        public DateTime? DyeLotDueDate { get; set; }
        public string DyeLotStatus { get; set; }

        public DateTime? VCodeDueDate { get; set; }
        public string VCodeStatus { get; set; }

        public DateTime? ShadeApprovalDueDate { get; set; }
        public string ShadeApprovalStatus { get; set; }

        public DateTime? JssDueDate { get; set; }
        public string JssStatus { get; set; }

        public DateTime? TrimCardSewingDueDate { get; set; }
        public string TrimCardSewingStatus { get; set; }

        public DateTime? TrimCardFinishingDueDate { get; set; }
        public string TrimCardFinishingStatus { get; set; }

        public DateTime? TestReportDueDate { get; set; }
        public string TestReportStatus { get; set; }

        public DateTime? SewingTrimsDueDate { get; set; }
        public string SewingTrimsStatus { get; set; }

        public DateTime? FinishingTrimsDueDate { get; set; }
        public string FinishingTrimsStatus { get; set; }

        public DateTime? PlanCutDate { get; set; }

        public DateTime? ClarificationDueDate { get; set; }
        public string ClarificationStatus { get; set; }

        public DateTime? TopSampleDueDate { get; set; }
        public string TopSampleStatus { get; set; }

        public int? Cutting { get; set; }
        public int? Sewing { get; set; }
        public int? Finishing { get; set; }
        public int? ShippedQuantity { get; set; }

        public string Notes { get; set; }
    }

    public class TnaUpdateViewModel
    {
        public int PurchaseOrderId { get; set; }
        public string Property { get; set; }
        public string Value { get; set; }
    }
}
