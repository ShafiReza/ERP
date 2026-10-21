using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class Medicine : BaseEntity
    {
        public int MedicineID { get; set; }
        public string MedicineName { get; set; }
        public decimal? UnitPrice { get; set; }
    }
}
