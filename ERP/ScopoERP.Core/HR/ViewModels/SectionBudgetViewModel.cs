using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class SectionBudgetViewModel
    {
        public int Id { get; set; }

        public int? SectionId { get; set; }
        public string SectionName { get; set; }
        public string Caption { get; set; }
        public string Floor { get; set; }
        public decimal? Budget { get; set; }
        public decimal? InterimBudget { get; set; }
        public decimal? SalaryBudget { get; set; }

        public int? CurrentManpower { get; set; }
        public int? Balance { get; set; }
    }
}
