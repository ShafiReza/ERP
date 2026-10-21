using System.Collections.Generic;

namespace ScopoERP.Common.ViewModel
{
    public class ShipmentPerDay
    {
        public ShipmentPerDay()
        {
            Dates = new List<int>();
            Amounts = new List<int>();
        }
        public List<int> Dates { get; set; }
        public List<int> Amounts { get; set; }
    }
}
