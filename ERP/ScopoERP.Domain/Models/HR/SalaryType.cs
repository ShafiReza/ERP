using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class SalaryType : BaseEntity
    {
        public int SalaryTypeID { get; set; }

        public string SalaryTypeName { get; set; }
    }
}
