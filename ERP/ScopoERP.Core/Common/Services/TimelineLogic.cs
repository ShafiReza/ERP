using AutoMapper;
using ScopoERP.Common.ViewModel;
using ScopoERP.Core.Mapper;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace ScopoERP.Common.BLL
{
    public class TimelineLogic
    {
        private UnitOfWork unitOfWork;
        private IMapper mapper;

        public TimelineLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            mapper = MapperConfigure.Initialize();
        }

        public List<TimelineViewModel> GetAllTimelineByUser(string assignTo = null, DateTime? fromDate = null, DateTime? toDate = null,
            int? purchaseOrderId = null, string activityStatus = null)
        {
            var query = $"EXEC GetTimeAndActionCalendar '" + assignTo + "'";
            var timeLines = unitOfWork.TimeLineRepository.SelectQuery<TimelineViewModel>(query).ToList();

            return timeLines;
        }

        public void UpdateTimeline(List<TnaUpdateViewModel> tnaList)
        {
            foreach(var tna in tnaList)
            {
                var data = unitOfWork.TimeLineRepository.Get().SingleOrDefault(x => x.PurchaseOrderId == tna.PurchaseOrderId);

                if (data == null)
                    data = new Timelines() { PurchaseOrderId = tna.PurchaseOrderId };

                Type type = typeof(Timelines);
                PropertyInfo propertyInfo = type.GetProperty(tna.Property);
                propertyInfo.SetValue(data, tna.Value);

                if(data.TimelineID == 0)
                    unitOfWork.TimeLineRepository.Insert(data);
                else
                    unitOfWork.TimeLineRepository.Update(data);

                unitOfWork.Save();
            }
        }
    }
}
