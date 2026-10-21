using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class BankSalaryViewModel
    {
        public int ID { get; set; }
        public int EmployeeID { get; set; }
     
        public string CardNo { get; set; }
  
        public string EmployeeName { get; set; }
        public string Designation { get; set; }
        public string AccountNo { get; set; }
        public string BankName { get; set; }
        public string Company { get; set; }
        public decimal? Amount { get; set; }
        public decimal? GrossSalary { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<DateTime> LastModified { get; set; }
        public bool IsDeleted { get; set; }
    }
}
