using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class StyleOperations
    {
 

        [Key]
        public int StyleOperationID { get; set; }

        public int StyleID { get; set; }
        public string Floor { get; set; }
        public string Line { get; set; }

        public int? Sequence { get; set; }

        public decimal? sam { get; set; }

        public decimal? AuxSam { get; set; }

        public int? MachineID { get; set; }

        public int? SectionNo { get; set; }

        public decimal? NoOfWS { get; set; }

        public int? SupervisorID { get; set; }

        [StringLength(100)]
        public string Size { get; set; }

        public int? SpecID { get; set; }

        public int OperationID { get; set; }

        [StringLength(250)]
        public string Caption { get; set; }

        [StringLength(100)]
        public string StyleOperationName { get; set; }

        [StringLength(50)]
        public string ModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public string TopOrBottom { get; set; }


    }
}
