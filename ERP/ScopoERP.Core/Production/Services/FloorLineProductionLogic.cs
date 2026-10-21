using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.Services
{
    public class FloorLineProductionLogic
    {
        private UnitOfWork unitOfWork;

        public FloorLineProductionLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<FloorLineProductionViewModel> GetAll()
        {
            var query = (from d in unitOfWork.FloorLineProductionRepository.Get()
                         join s in unitOfWork.StyleRepository.Get() on d.StyleId equals s.StyleId
                         select new FloorLineProductionViewModel
                         {
                             ID = d.ID,
                             Floor = d.Floor,
                             Line = d.Line,
                             ProductionDate = d.ProductionDate,
                             StyleId = d.StyleId,
                             StyleNo = s.StyleNo,
                             SAM = d.SAM,
                             CM = d.CM,
                             StyleStartDate = d.StyleStartDate,
                             DirectManPower = d.DirectManPower,
                             TargetEfficencyInPercentage = d.TargetEfficencyInPercentage,
                             ForecastSAH = d.ForecastSAH,
                             TotalWorkHrs = d.TotalWorkHrs,
                             ProductionTGT = d.ProductionTGT,
                             DayProduction = d.DayProduction,
                             ProducedHrs = d.ProducedHrs,
                             DayCMEarning = d.DayCMEarning,
                             ActualWorkHrs= d.ActualWorkHrs,
                         });

            var data = query.ToList();

            return data.OrderByDescending(x => x.ID).ToList();
        }



        public FloorLineProductionViewModel Update(FloorLineProductionViewModel floorLineProductionVM)
        {
            // Retrieve the existing FloorLineProduction record from the database using the ID
            var existingProduction = unitOfWork.FloorLineProductionRepository.Get()
                                          .FirstOrDefault(f => f.ID == floorLineProductionVM.ID);

            // Check if the existing production record is found
            if (existingProduction != null)
            {
                // Update the properties of the existing production record
                existingProduction.Floor = floorLineProductionVM.Floor;
                existingProduction.Line = floorLineProductionVM.Line;
                existingProduction.ProductionDate = floorLineProductionVM.ProductionDate;
                existingProduction.StyleId = floorLineProductionVM.StyleId;
                existingProduction.SAM = floorLineProductionVM.SAM;
                existingProduction.CM = floorLineProductionVM.CM;
                existingProduction.StyleStartDate = floorLineProductionVM.StyleStartDate;
                existingProduction.DirectManPower = floorLineProductionVM.DirectManPower;
                existingProduction.TargetEfficencyInPercentage = floorLineProductionVM.TargetEfficencyInPercentage;
                existingProduction.ForecastSAH = floorLineProductionVM.ForecastSAH;
                existingProduction.TotalWorkHrs = floorLineProductionVM.TotalWorkHrs;
                existingProduction.ProductionTGT = floorLineProductionVM.ProductionTGT;
                existingProduction.DayProduction = floorLineProductionVM.DayProduction;
                existingProduction.ProducedHrs = floorLineProductionVM.ProducedHrs;
                existingProduction.DayCMEarning = floorLineProductionVM.DayCMEarning;
                existingProduction.ActualWorkHrs= floorLineProductionVM.ActualWorkHrs;

                // Attach the existing production record to the context and mark it as modified
                unitOfWork.FloorLineProductionRepository.Update(existingProduction);
                unitOfWork.Save();

                // Return the updated view model
                return floorLineProductionVM;
            }

            // If the record was not found, you may want to handle it accordingly (e.g., throw an exception or return null)
            throw new Exception("FloorLineProduction record not found.");
        }

        public FloorLineProductionViewModel Create(FloorLineProductionViewModel floorLineProductionVM)
        {
            var floorLineProduction = new FloorLineProduction
            {
                Floor = floorLineProductionVM.Floor,
                Line = floorLineProductionVM.Line,
                ProductionDate = floorLineProductionVM.ProductionDate,
                StyleId = floorLineProductionVM.StyleId,
                SAM = floorLineProductionVM.SAM,
                CM = floorLineProductionVM.CM,
                StyleStartDate = floorLineProductionVM.StyleStartDate,
                DirectManPower = floorLineProductionVM.DirectManPower,
                TargetEfficencyInPercentage = floorLineProductionVM.TargetEfficencyInPercentage,
                ForecastSAH = floorLineProductionVM.ForecastSAH,
                TotalWorkHrs = floorLineProductionVM.TotalWorkHrs,
                ProductionTGT = floorLineProductionVM.ProductionTGT,
                DayProduction = floorLineProductionVM.DayProduction,
                ProducedHrs = floorLineProductionVM.ProducedHrs,
                DayCMEarning = floorLineProductionVM.DayCMEarning,
                ActualWorkHrs = floorLineProductionVM.ActualWorkHrs
            };

            unitOfWork.FloorLineProductionRepository.Insert(floorLineProduction);
            unitOfWork.Save();

            floorLineProductionVM.ID = floorLineProduction.ID;
            return floorLineProductionVM;
        }

        private int GetRunDays(DateTime productionDate)
        {
            // Get today's date
            DateTime today = DateTime.Today;

            // Calculate the difference in days
            TimeSpan difference = today - productionDate;

            // Return the number of days
            return difference.Days;
        }

        public List<FloorLineProductionReportViewModel> GetFloorLineProductionReport(DateTime date)
        {
            var query = (from d in unitOfWork.FloorLineProductionRepository.Get()
                         join s in unitOfWork.StyleRepository.Get() on d.StyleId equals s.StyleId
                         where d.ProductionDate == date
                         select new FloorLineProductionReportViewModel
                         {
                             Floor = d.Floor,
                             Line = d.Line,
                             ProductionDate = d.ProductionDate,
                             StyleId = d.StyleId,
                             StyleNo = s.StyleNo,
                             SAM = d.SAM,
                             CM = d.CM,
                             StyleStartDate = d.StyleStartDate,
                             DirectManPower = d.DirectManPower,
                             TargetEfficencyInPercentage = d.TargetEfficencyInPercentage,
                             ForecastSAH = d.ForecastSAH,
                             TotalWorkHrs = d.TotalWorkHrs,
                             AvgWorkHrs = d.TotalWorkHrs/d.DirectManPower,
                             ProductionTGT = (d.DirectManPower * d.ActualWorkHrs * 60 / d.SAM) * (d.TargetEfficencyInPercentage / 100),
                             DayProduction = d.DayProduction,
                             ProducedHrs = (d.SAM*d.DayProduction)/60,
                             DayCMEarning = d.DayProduction * d.CM,
                             RunDays = DbFunctions.DiffDays(d.ProductionDate, DateTime.Today),
                             DayEfficency = (((d.SAM * d.DayProduction) / 60) / d.TotalWorkHrs) * 100,
                             DayPerformance = (d.ProducedHrs / d.ForecastSAH) * 100,
                             DayExpCMEarning = d.TotalWorkHrs * 60 * 0.0415, //cpm = 0.0415
                             PlanCMTarget = d.ProductionTGT * d.CM,
                             ActualWorkHrs= d.ActualWorkHrs,

                         }).ToList();

            foreach (var item in query)
            {
                var today = date;
                var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);

                var MonthToDateData = unitOfWork.FloorLineProductionRepository.Get()
                    .Where(x => x.Floor == item.Floor && x.Line == item.Line && x.ProductionDate >= firstDayOfMonth && x.ProductionDate <= today)
                    .ToList();
                // var MonthToDateData = unitOfWork.FloorLineProductionRepository.Get().Where(x => x.Floor == item.Floor && x.Line == item.Line && x.StyleId == item.StyleId).ToList();
                // Calculate MTDWorkHrs for each floor, line, and production date
                var mtdWorkHrsByFloorLineAndDate = MonthToDateData
                    .GroupBy(x => new { x.Floor, x.Line, x.ProductionDate })
                    .Select(g => new
                    {
                        Floor = g.Key.Floor,
                        Line = g.Key.Line,
                        ProductionDate = g.Key.ProductionDate,
                        TotalWorkHrs = g.First().TotalWorkHrs, // Take TotalWorkHrs once per group
                        DirectManPowerOnLine = g.First().DirectManPower,
                    })
                    .ToList();

                // Sum the TotalWorkHrs to get the MTDWorkHrs
                double? MTDWorkHrs = mtdWorkHrsByFloorLineAndDate.Sum(x => x.TotalWorkHrs);

                int? MTDManpower = mtdWorkHrsByFloorLineAndDate.Sum(x => x.DirectManPowerOnLine);

                var temp = MonthToDateData.Sum(d =>
                {
                    // Ensure none of the values are zero or null
                    if (d.DirectManPower == 0 || d.ActualWorkHrs == 0 || d.SAM == 0 || d.TargetEfficencyInPercentage == 0 || d.CM == 0)
                    {
                        Console.WriteLine($"Skipping item due to zero value: {d}");
                        return 0;
                    }

                    // Perform the calculation with type casting
                    var directManPower = (double)d.DirectManPower;
                    var actualWorkHrs = (double)d.ActualWorkHrs;
                    var sam = (double)d.SAM;
                    var targetEfficencyInPercentage = (double)d.TargetEfficencyInPercentage;
                    var cm = (double)d.CM;

                    var result = ((directManPower * actualWorkHrs * 60 / sam) * (targetEfficencyInPercentage / 100.0)) * cm;


                    return result;
                });
                var MTDProducedHrs = MonthToDateData.Sum(d =>
                {
                   
                    var sam = (double)d.SAM;
                 
                    var dayProduction = (double)d.DayProduction;

                    var result = (sam*dayProduction)/60;


                    return result;
                });

                item.MTDAvgWorkHrs = MTDWorkHrs / MTDManpower;
                item.MTDDayEfficency = (MTDProducedHrs / MTDWorkHrs)*100;
                item.MTDProduction = MonthToDateData.Sum(x => x.DayProduction);
                item.MTDDayCMEarning = MonthToDateData.Sum(x => x.DayProduction * x.CM);
                item.MTDCMTarget = (decimal)temp;
                item.MTDProducedHrs = MTDProducedHrs;
                item.MTDWorkHrs = MTDWorkHrs;
                item.MTDManpower = MTDManpower;
            }


            return query;

    
        }
    }
}
