using AutoMapper;
using ScopoERP.Core.Mapper;
using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Production.Services
{
    public class HourlyProductionService
    {
        private UnitOfWork unitOfWork;
        private IMapper mapper;

        public HourlyProductionService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            mapper = MapperConfigure.Initialize();
        }

        public void SaveHourlyProductionStatus(List<HourlyProductionStatusViewModel> hourlyProductionStatusList)
        {
            int poId = hourlyProductionStatusList[0].PurchaseOrderId;
            int section = hourlyProductionStatusList[0].Section;
            DateTime date = hourlyProductionStatusList[0].Date;
            int hour = hourlyProductionStatusList[0].Hour;
            string floor = hourlyProductionStatusList[0].Floor;
            string line = hourlyProductionStatusList[0].Line;

            var existingData = unitOfWork.HourlyProductionStatusRepository.Get()
                .Where(x => x.PurchaseOrderId == poId
                && x.Date == date && x.Hour == hour
                && x.Section == section && x.Floor == floor && x.Line == line).ToList();
            unitOfWork.HourlyProductionStatusRepository.DeleteRange(existingData);

            foreach (var productionStatus in hourlyProductionStatusList)
            {
                var data = mapper.Map<HourlyProductionStatus>(productionStatus);
                unitOfWork.HourlyProductionStatusRepository.Insert(data);

            }
            unitOfWork.Save();
        }

        public List<ProductionStatusViewModel> GetHourlyProductionStatus(DateTime date, int hour, string floor, string line, int section, int purchaseOrderId)
        {
            var data = (from hp in unitOfWork.HourlyProductionStatusRepository.Get()
                        join op in unitOfWork.StandardOperationRepository.Get() on hp.SpecId equals op.OperationID
                        where hp.Hour == hour && hp.Date == date
                        && hp.Section == section
                        && hp.PurchaseOrderId == purchaseOrderId
                        && hp.Floor == floor
                        && hp.Line == line
                        orderby hp.Sequence, hp.ProductionStatusID
                        select new ProductionStatusViewModel
                        {
                            SpecId = hp.SpecId,
                            SpecNo = op.OperationName,
                            Section = hp.Section,
                            Sam = hp.Sam,
                            Sequence = hp.Sequence,
                            CardNo = hp.CardNo,
                            Output = hp.Output,
                            DownTime = hp.DownTime,
                            CheckQty = hp.CheckQty,
                            DefectCodes = hp.DefectCodes,
                        }).ToList();

            if (data.Count == 0 || data == null)
            {
                int maxHour = unitOfWork.HourlyProductionStatusRepository.Get().Where(x => x.Date == date && x.Section == section && x.PurchaseOrderId == purchaseOrderId && x.Floor == floor && x.Line == line).Max(hp => (int?)hp.Hour) ?? 1;

                data = (from hp in unitOfWork.HourlyProductionStatusRepository.Get()
                        join op in unitOfWork.StandardOperationRepository.Get() on hp.SpecId equals op.OperationID
                        where hp.Hour == maxHour && hp.Date == date
                        && hp.Section == section
                        && hp.PurchaseOrderId == purchaseOrderId
                        && hp.Floor == floor
                        && hp.Line == line
                        orderby hp.Sequence, hp.ProductionStatusID
                        select new ProductionStatusViewModel
                        {
                            SpecId = hp.SpecId,
                            SpecNo = op.OperationName,
                            Section = hp.Section,
                            Sam = hp.Sam,
                            Sequence = hp.Sequence,
                            CardNo = hp.CardNo,
                        }).ToList();
            }

            if (data.Count == 0 || data == null)
            {
                data = (from so in unitOfWork.StyleOperationRepository.Get()
                        join op in unitOfWork.StandardOperationRepository.Get() on so.OperationID equals op.OperationID
                        join st in unitOfWork.StyleRepository.Get() on so.StyleID equals st.StyleId
                        join po in unitOfWork.PurchaseOrderRepository.Get() on st.StyleId equals po.StyleId
                        where so.SectionNo == section
                        && po.PoStyleId == purchaseOrderId
                        && so.Floor == floor
                        && so.Line == line
                        select new ProductionStatusViewModel
                        {
                            SpecId = so.OperationID,
                            SpecNo = op.OperationName,
                            Section = so.SectionNo,
                            Sam = so.sam,
                            Sequence = so.Sequence,
                            NoOfWS = so.NoOfWS
                        }).ToList();


                int i = 0;
                while (i < data.Count)
                {
                    for (int j = 1; j < Math.Ceiling((decimal)data[i].NoOfWS); j++)
                    {
                        data.Insert(i + 1, data[i]);
                        i++;
                    }
                    i++;
                }
            }

            return data;
        }

        public List<LineBalanceViewModel> GetLineBalanceData(DateTime date, int hour, string floor, string line)
        {
            var data = (from hp in unitOfWork.HourlyProductionStatusRepository.Get()
                        join op in unitOfWork.StandardOperationRepository.Get() on hp.SpecId equals op.OperationID
                        where  hp.Date == date && hp.Hour == hour && hp.Floor == floor && hp.Line == line
                        && hp.CardNo != "0"
                        group hp by new { op.OperationName, hp.Section } into g
                        select new LineBalanceViewModel
                        {
                            Sequence = g.Min(x => x.Sequence),
                            OpeartionNo = g.Key.OperationName + "(" + g.Key.Section + ")",
                            Output = g.Sum(x => x.Output),
                            DownTime = g.Sum(x => x.DownTime),
                            Sam = g.Min(x => x.Sam),
                            NoOfWS = g.Count(),
                        }).OrderBy(x => x.Sequence).ToList();

            if (data.Any())
            {
                int target = (int)(data.Sum(x => x.NoOfWS) * 60 / data.Sum(x => x.Sam));
                data.ForEach(x => x.Target = target);

                //data[0].MaxLoad = data.Min(x => x.Output / (x.NoOfWS * 60));
                //data[0].PitchTime = data.Sum(x => x.Output) / (data.Sum(x => x.NoOfWS) * 60);
                //data[0].Efficiency = data[0].PitchTime / data[0].MaxLoad;
            }

            return data;
        }
    }
}
