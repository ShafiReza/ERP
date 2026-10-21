using ScopoERP.Domain.Repositories;
using System;
using System.Linq;

namespace ScopoERP.Core.API
{
    public class DashboardService
    {
        private UnitOfWork unitOfWork;
        public DashboardService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public double Efficiency(string floor) => 0;

        public double MMR(string floor) => 0;

        public decimal CutToShip(string floor)
        {
            DateTime now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var cutting = (from p in unitOfWork.ProductionStatusRepository.Get()
                           where p.Floor == floor
                           group p by p.PurchaseOrderId into g
                           select new { PurchaseOrderId = g.Key, Cutting = g.Sum(x => x.Cutting) }).AsQueryable();

            var data = (from s in unitOfWork.ShipmentRepository.Get()
                        join c in cutting on s.PurchaseOrderID equals c.PurchaseOrderId
                        where s.ChalanDate >= startDate && s.ChalanDate <= endDate
                        group new { s, c } by 1 into g
                        select g.Sum(x => x.s.ChalanQuantity) / g.Sum(x => x.c.Cutting) ?? 0 * 100
                        ).SingleOrDefault();


            return Math.Round(data, 2);
        }

        public double OrderToShip(string floor)
        {
            DateTime now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var production = unitOfWork.ProductionStatusRepository.Get()
                .Where(x => x.Floor == floor)
                .Select(x => x.PurchaseOrderId)
                .Distinct().ToList();

            var data = (from s in unitOfWork.ShipmentRepository.Get()
                        join p in unitOfWork.PurchaseOrderRepository.Get() on s.PurchaseOrderID equals p.PoStyleId
                        join po in production on s.PurchaseOrderID equals po
                        where s.ChalanDate >= startDate && s.ChalanDate <= endDate
                        group new { s, p } by 1 into g
                        select (double)g.Sum(x => x.s.ChalanQuantity) / (double)g.Sum(x => x.p.OrderQuantity) * 100
                        ).SingleOrDefault();

            return Math.Round(data, 2);
        }

        public double OnTimeDelivery(string floor)
        {
            DateTime now = DateTime.Now;
            var startDate = new DateTime(now.Year, now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var noOfShipment = (from s in unitOfWork.ShipmentRepository.Get()
                               where s.ChalanDate >= startDate && s.ChalanDate <= endDate
                               select s).Count();

            var noOfOnTimeShipment = (from s in unitOfWork.ShipmentRepository.Get()
                                      join p in unitOfWork.PurchaseOrderRepository.Get() on s.PurchaseOrderID equals p.PoStyleId
                                      where s.ChalanDate >= startDate && s.ChalanDate <= endDate
                                      && s.ChalanDate <= p.ExitDate
                                      select s).Count();

            return (noOfOnTimeShipment / (noOfShipment == 0 ? 1 : noOfShipment)) * 100;
        }

        public double StyleChangeOverTime(string floor) => 0;

        public double RightFirstTime(string floor) => 0;

        public double Downtime(string floor) => 0;

        public double CostPerMinute(string floor) => 0;

        public int Manpower(string floor)
        {
            string _db = floor == "Unit-One" || floor == "Unit-Two" ? "DMCHR" : "ScopoHR";
            
            string query = $"SELECT COUNT(*) FROM {_db}..Employees E " +
                $"INNER JOIN {_db}..ProductionFloorLines F ON E.ProductionFloorLineId = F.ProductionFloorLineId " +
                $"WHERE E.IsActive = 1 " +
                $"AND F.Floor = '{floor}'";

            var data = unitOfWork.ProductionStatusRepository.SelectQuery<int>(query);

            return data.Count > 0 ? data[0] : 0;
        }

        public double NewJoin(string floor)
        {
            string _db = floor == "Unit-One" || floor == "Unit-Two" ? "DMCHR" : "ScopoHR";

            var firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            string query = $"SELECT COUNT(*) FROM {_db}..Employees E " +
                $"INNER JOIN {_db}..ProductionFloorLines F ON E.ProductionFloorLineId = F.ProductionFloorLineId " +
                $"WHERE E.IsActive = 1 " +
                $"AND F.Floor = '{floor}' " +
                $"AND CAST(E.JoinDate AS DATE) BETWEEN '{firstDayOfMonth}' AND '{lastDayOfMonth}'";

            var data = unitOfWork.ProductionStatusRepository.SelectQuery<int>(query);

            return data.Count > 0 ? data[0] : 0;
        }

        public double Dropout(string floor)
        {
            string _db = floor == "Unit-One" || floor == "Unit-Two" ? "DMCHR" : "ScopoHR";

            var firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            string query = $"SELECT COUNT(*) FROM {_db}..Employees E " +
                $"INNER JOIN {_db}..ProductionFloorLines F ON E.ProductionFloorLineId = F.ProductionFloorLineId " +
                $"INNER JOIN {_db}..InActiveEmployees I ON E.EmployeeID = I.EmployeeID " +
                $"WHERE E.IsActive = 0 " +
                $"AND F.Floor = '{floor}' " +
                $"AND CAST(I.ApplicableDate AS DATE)  BETWEEN '{firstDayOfMonth}' AND '{lastDayOfMonth}'";

            var data = unitOfWork.ProductionStatusRepository.SelectQuery<int>(query);

            return data.Count > 0 ? data[0] : 0;
        }
    }
}
