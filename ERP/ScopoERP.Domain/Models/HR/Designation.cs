using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class Designation : BaseEntity
    {
        public int DesignationID { get; set; }
        public string DesignationName { get; set; }
        public string DesignationNameBangla { get; set; }
        public int DepartmentID { get; set; }
        public bool IsOverTimeApplicable { get; set; }
        public int? Tofshil { get; set; }
        public int? Grade { get; set; }
        public string WorkType { get; set; }
        public decimal? NightBill { get; set; }
        public decimal? TiffinBill { get; set; }
        public decimal? HolidayBill { get; set; }
        public string WorkTypeEnglish { get; set; }
    }
}
