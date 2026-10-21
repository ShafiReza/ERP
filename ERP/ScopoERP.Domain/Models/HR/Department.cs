using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class Department
    {
        [Key]
        public int DepartmentID { get; set; }

        public string DepartmentName { get; set; }

        public string DepartmentNameBangla { get; set; }
        public int BranchID { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? LastModified { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
