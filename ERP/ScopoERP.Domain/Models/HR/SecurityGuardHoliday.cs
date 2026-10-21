using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class SecurityGuardHoliday
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeID { get; set; }
        public string WeeklyHoliday { get; set; }
        [StringLength(20)]
        public string ModifiedBy { get; set; }
        public DateTime? LastModified { get; set; }
    }
}
