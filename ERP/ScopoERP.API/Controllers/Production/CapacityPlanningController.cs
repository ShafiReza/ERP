using ScopoERP.ProductionStatus.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Production
{
    [Authorize]
    public class CapacityPlanningController : ApiController
    {
        private CapacityPlanningLogic capacityPlanningLogic;

        public CapacityPlanningController(CapacityPlanningLogic _capacityPlanningLogic)
        {
            capacityPlanningLogic = _capacityPlanningLogic;
        }

        [HttpGet]
        public IHttpActionResult GetAll(DateTime fromDate, DateTime toDate, int factoryId)
        {
            var result = capacityPlanningLogic.GetCapacityPlanning(fromDate, toDate, factoryId);

            if (result == null) return NotFound();

            return Ok(result);
        }
    }
}