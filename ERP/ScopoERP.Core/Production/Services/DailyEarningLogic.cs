using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.Services
{
    public class DailyEarningLogic
    {
        private DailyEarning dailyEarning;
        private UnitOfWork unitOfWork;

        public DailyEarningLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<DailyEarningViewModel> GetAllDailyEarning(DateTime? fromDate, DateTime? toDate, string floor)
        {
            var query = (from d in unitOfWork.DailyEarningRepository.Get()
                         join s in unitOfWork.StyleRepository.Get() on d.StyleId equals s.StyleId
                         where floor != null ? d.Floor == floor : d.Floor == d.Floor
                         select new DailyEarningViewModel
                         {
                             DailyEarningID = d.DailyEarningID,
                             Date = d.Date,
                             FinishingQty = d.FinishingQty,
                             Floor = d.Floor,
                             Line = d.Line,
                             StyleId = d.StyleId,
                             StyleNo = s.StyleNo,
                             ExpectedEfficiency = d.ExpectedEfficiency,
                             DailyEarningTGT= d.DailyEarningTGT,
                             ActualEarning = d.ActualEarning,
                             PurchaseOrderId = d.PurchaseOrderId,
                             HitRate = (d.ActualEarning/ d.DailyEarningTGT) * 100,
                             ProfitAndLoss = d.ActualEarning - d.DailyEarningTGT,
                             CM = d.CM,
                             Hour = d.Hour,
                             DirectManpower = d.DirectManpower,
                             AvailableMinutes = d.AvailableMinutes,
                             SewingQty = d.SewingQty,
                             CPM = d.CPM,
                             Remarks = d.Remarks,
                             ModifiedBy= d.ModifiedBy,
                             LastModifiedDate= d.LastModifiedDate,
                         });

            if (fromDate != null && toDate != null)
            {
                query = query.Where(x => x.Date >= fromDate && x.Date <= toDate);
            }

            if (fromDate == null || toDate == null)
            {
                query = query.Take(20);
            }

            var data = query.ToList();

            foreach(var item in data )
            {
                var cumulativeProfitAndLossQuery = unitOfWork.DailyEarningRepository.Get().Where(x => x.StyleId == item.StyleId && x.Floor == item.Floor);
                item.CumulativeProfitAndLoss = cumulativeProfitAndLossQuery.Sum(d => d.ActualEarning - d.DailyEarningTGT);
                item.CumulativeActualEarn = cumulativeProfitAndLossQuery.Sum(d => d.ActualEarning);
                item.CumulativeEarningTGT = cumulativeProfitAndLossQuery.Sum(d => d.DailyEarningTGT);
                if(item.CumulativeEarningTGT > 0)
                {
                    item.CumulativeProduction = item.CumulativeActualEarn/ item.CumulativeEarningTGT;
                    item.CumulativeProfitAndLossPercentage = (item.CumulativeProduction - 1) * 100;
                }
            }

            return data.OrderByDescending(x => x.DailyEarningID).ToList();
        }



        public DailyEarningViewModel Update(DailyEarningViewModel dailyEarningVM)
        {
            dailyEarning = new DailyEarning
            {
                DailyEarningID= dailyEarningVM.DailyEarningID,
                Date = dailyEarningVM.Date,
                FinishingQty = dailyEarningVM.FinishingQty,
                Floor = dailyEarningVM.Floor,
                Line = dailyEarningVM.Line,
                StyleId = dailyEarningVM.StyleId,
                ExpectedEfficiency = dailyEarningVM.ExpectedEfficiency,
                DailyEarningTGT= dailyEarningVM.DailyEarningTGT,
                ActualEarning = dailyEarningVM.ActualEarning,   
                PurchaseOrderId= dailyEarningVM.PurchaseOrderId,
                CM = dailyEarningVM.CM,
                Hour = dailyEarningVM.Hour,
                DirectManpower = dailyEarningVM.DirectManpower,
                AvailableMinutes = dailyEarningVM.AvailableMinutes,
                SewingQty = dailyEarningVM.SewingQty,
                CPM = dailyEarningVM.CPM,
                Remarks = dailyEarningVM.Remarks,
                ModifiedBy= dailyEarningVM.ModifiedBy,
                LastModifiedDate= DateTime.Now,
            };
            unitOfWork.DailyEarningRepository.Update(dailyEarning);
            unitOfWork.Save();

            return dailyEarningVM;
        }

        public DailyEarningViewModel Create(DailyEarningViewModel dailyEarningVM)
        {
            dailyEarning = new DailyEarning
            {
                Date = dailyEarningVM.Date,
                FinishingQty = dailyEarningVM.FinishingQty,
                Floor = dailyEarningVM.Floor,
                Line = dailyEarningVM.Line,
                StyleId = dailyEarningVM.StyleId,
                ExpectedEfficiency = dailyEarningVM.ExpectedEfficiency,
                DailyEarningTGT = dailyEarningVM.DailyEarningTGT,
                ActualEarning = dailyEarningVM.ActualEarning,
                PurchaseOrderId = dailyEarningVM.PurchaseOrderId,
                CM = dailyEarningVM.CM,
                Hour = dailyEarningVM.Hour,
                DirectManpower = dailyEarningVM.DirectManpower,
                AvailableMinutes = dailyEarningVM.AvailableMinutes,
                SewingQty = dailyEarningVM.SewingQty,
                CPM = dailyEarningVM.CPM,
                Remarks = dailyEarningVM.Remarks,
                ModifiedBy = dailyEarningVM.ModifiedBy,
                LastModifiedDate = DateTime.Now,
            };
            unitOfWork.DailyEarningRepository.Insert(dailyEarning);
            unitOfWork.Save();

            dailyEarningVM.DailyEarningID = dailyEarning.DailyEarningID; 
            return dailyEarningVM;
        }

    }
}
