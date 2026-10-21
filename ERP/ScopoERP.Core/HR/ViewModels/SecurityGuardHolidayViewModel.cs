using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class SecurityGuardHolidayViewModel
    {
        public int Id { get; set; }
        public int EmployeeID { get; set; }
        public string CardNo { get; set; }
        public string WeeklyHoliday { get; set; }

        public string ModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
    }
}
