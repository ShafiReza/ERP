using ScopoERP.Core.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/Dashboard")]
    public class DashboardController : ApiController
    {
        private DashboardService dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            this.dashboardService = dashboardService;
        }

        [Route("Efficiency")]
        [HttpGet]
        public IHttpActionResult Efficiency(string floor)
        {
            return Ok(dashboardService.Efficiency(floor));
        }

        [Route("MMR")]
        [HttpGet]
        public IHttpActionResult MMR(string floor)
        {
            return Ok(dashboardService.MMR(floor));
        }

        [Route("CutToShip")]
        [HttpGet]
        public IHttpActionResult CutToShip(string floor)
        {
            return Ok(dashboardService.CutToShip(floor));
        }

        [Route("OrderToShip")]
        [HttpGet]
        public IHttpActionResult OrderToShip(string floor)
        {
            return Ok(dashboardService.OrderToShip(floor));
        }

        [Route("OnTimeDelivery")]
        [HttpGet]
        public IHttpActionResult OnTimeDelivery(string floor)
        {
            return Ok(dashboardService.OnTimeDelivery(floor));
        }

        [Route("StyleChangeOverTime")]
        [HttpGet]
        public IHttpActionResult StyleChangeOverTime(string floor)
        {
            return Ok(dashboardService.StyleChangeOverTime(floor));
        }

        [Route("RightFirstTime")]
        [HttpGet]
        public IHttpActionResult RightFirstTime(string floor)
        {
            return Ok(dashboardService.RightFirstTime(floor));
        }

        [Route("Downtime")]
        [HttpGet]
        public IHttpActionResult Downtime(string floor)
        {
            return Ok(dashboardService.Downtime(floor));
        }

        [Route("CostPerMinute")]
        [HttpGet]
        public IHttpActionResult CostPerMinute(string floor)
        {
            return Ok(dashboardService.CostPerMinute(floor));
        }

        [Route("Manpower")]
        [HttpGet]
        public IHttpActionResult Manpower(string floor)
        {
            return Ok(dashboardService.Manpower(floor));
        }

        [Route("NewJoin")]
        [HttpGet]
        public IHttpActionResult NewJoin(string floor)
        {
            return Ok(dashboardService.NewJoin(floor));
        }

        [Route("Dropout")]
        [HttpGet]
        public IHttpActionResult Dropout(string floor)
        {
            return Ok(dashboardService.Dropout(floor));
        }
    }
}
