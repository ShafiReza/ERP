using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class SpecialShift
    {
        [Key]
        public int ID { get; set; }
        public int? ShiftID { get; set; }
        public DateTime? WorkingDate { get; set; }
        public DateTime? InTime { get; set; }
        public DateTime? OutTime { get; set; }
        public bool? CrossesDay { get; set; }
    }
}
