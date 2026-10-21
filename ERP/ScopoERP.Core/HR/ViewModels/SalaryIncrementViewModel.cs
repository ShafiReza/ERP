using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class SalaryIncrementViewModel
    {
        public int SalaryIncrementID { get; set; }
        public int EmployeeID { get; set; }
        public DateTime IncrementDate { get; set; }
        public decimal IncrementAmount { get; set; }
        public string CardNo { get; set; }
    }
}
