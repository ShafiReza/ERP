using ScopoERP.Core.Production.Services;
using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Production.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Production
{
    [Authorize]
    [RoutePrefix("api/HourlyProduction")]
    public class HourlyProductionController : ApiController
    {
        private HourlyProductionService hourlyProductionStatus;
        public HourlyProductionController(HourlyProductionService _hourlyProductionStatus)
        {
            this.hourlyProductionStatus = _hourlyProductionStatus;

        }

        [Route("SaveProductionStatus")]
        [HttpPost]
        public IHttpActionResult Post(List<HourlyProductionStatusViewModel> productionStatusList)
        {
            if (!ModelState.IsValid || productionStatusList is null || productionStatusList.Count == 0) return BadRequest();

            hourlyProductionStatus.SaveHourlyProductionStatus(productionStatusList);
            return Ok("Data Saved Successfully.");
        }
        [Route("GetProductionStatus")]
        [HttpGet]
        public IHttpActionResult GetProductionStatus(int section, DateTime date, int hour, int purchaseOrderId, string floor = null, string line = null)
        {
            var data = hourlyProductionStatus.GetHourlyProductionStatus(date, hour, floor, line, section, purchaseOrderId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetLineBalanceData")]
        [HttpGet]
        public IHttpActionResult GetLineBalanceData(DateTime date, int hour, string floor = null, string line = null)
        {
            var data = hourlyProductionStatus.GetLineBalanceData(date, hour, floor, line);

            if (data == null) return NotFound();

            return Ok(data);
        }
    }
}