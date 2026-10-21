using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class MappingSalaryListViewModel
    {
        public int EmployeeID { get; set; }
        public List<Salary> SalaryList { get; set; }
    }

    public class Salary
    {
        public int SalaryTypeID { get; set; }

        public string SalaryTypeName { get; set; }
        public int? SalaryMappingID { get; set; }
        public int EmployeeID { get; set; }
        public decimal? Amount { get; set; }
    }
}
