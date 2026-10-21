using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models
{
    public class DefectType
    {
        [Key]
        public int ID { get; set; }
        public string DefectTypeName { get; set; }
    }
}
