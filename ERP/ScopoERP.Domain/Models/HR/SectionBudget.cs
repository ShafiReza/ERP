using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class SectionBudget
    {
        [Key]
        public int Id { get; set; }

        public int? SectionId { get; set; }
        public string Floor { get; set; }
        public decimal? Budget { get; set; }
        public decimal? InterimBudget { get; set; }
        public decimal? SalaryBudget { get; set; }

    }
}
