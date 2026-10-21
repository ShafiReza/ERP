namespace ScopoERP.Domain.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;


    [Table("DailyProductionStatus")]
    public partial class DailyProductionStatus
    {
        public int Id { get; set; }
        public DateTime ProductionDate { get; set; }
        public int? Hour { get; set; }
        public int PurchaseOrderId { get; set; }
        [Required]
        public string Floor { get; set; }
        [Required]
        public string Line { get; set; }
        public decimal? Cutting { get; set; }
        public decimal? Sewing { get; set; }
        public decimal? Washing { get; set; }
        public decimal? Printing { get; set; }
        public decimal? Finishing { get; set; }

        public int? RunningMachine { get; set; }

        public string ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public string Color { get; set; }
        public decimal? SewingInput { get; set; }
        public decimal? SentToWash { get; set; }
        public decimal? FinishingInput { get; set; }
    }
}
