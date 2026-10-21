using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class HourlyProductionStatus : BaseEntity
    {
        [Key]
        public int ProductionStatusID { get; set; }
        public int PurchaseOrderId { get; set; }
        public DateTime Date { get; set; }
        public int Hour { get; set; }
        public int Section { get; set; }
        public int SpecId { get; set; }
        public string CardNo { get; set; }
        public int Output { get; set; }
        public int? DownTime { get; set; }
        public decimal? Sam { get; set; }
        public int? Sequence { get;set; }
        public string Floor { get; set; }
        public string Line { get; set; }
        public int? CheckQty { get; set; }
        public string DefectCodes { get; set; }
    }
}
