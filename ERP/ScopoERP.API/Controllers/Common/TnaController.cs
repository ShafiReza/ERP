using ScopoERP.Common.BLL;
using ScopoERP.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers
{
    [Authorize]
    public class TnaController : ApiController
    {
        private TimelineLogic timelineLogic;

        public TnaController(TimelineLogic timelineLogic)
        {
            this.timelineLogic = timelineLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(string assignTo = null, DateTime? fromDate = null, DateTime? toDate = null, 
            int? purchaseOrderId = null, string activityStatus = null)
        {
            var data = timelineLogic.GetAllTimelineByUser(assignTo, fromDate, toDate, purchaseOrderId, activityStatus);

            if(data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult UpdateTimeline(List<TnaUpdateViewModel> tnaList)
        {
            timelineLogic.UpdateTimeline(tnaList);

            return Ok();
        }
    }
}
