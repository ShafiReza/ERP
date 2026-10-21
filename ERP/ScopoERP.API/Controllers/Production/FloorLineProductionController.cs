using ScopoERP.Core.HR.Services;
using ScopoERP.Core.Production.Services;
using ScopoERP.Core.Production.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Production
{
    [RoutePrefix("api/FloorLineProduction")]
    public class FloorLineProductionController : ApiController
    {
        private FloorLineProductionLogic floorLineProductionLogic;

        public FloorLineProductionController(FloorLineProductionLogic _floorLineProductionLogic)
        {
            this.floorLineProductionLogic = _floorLineProductionLogic;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = floorLineProductionLogic.GetAll();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("FloorLineProductionReport")]
        [HttpGet]
        public IHttpActionResult GetFloorLineProductionReport(DateTime productionDate)
        {
            var data = floorLineProductionLogic.GetFloorLineProductionReport(productionDate);

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(FloorLineProductionViewModel floorLineProductionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var data = floorLineProductionLogic.Create(floorLineProductionVM);
            return Ok(data);
        }

        [HttpPut]
        public IHttpActionResult Put(FloorLineProductionViewModel floorLineProductionVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var data = floorLineProductionLogic.Update(floorLineProductionVM);
            return Ok(data);
        }
    }
}
