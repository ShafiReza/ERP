using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class UnitController : ApiController
    {
         private ConsumptionUnitLogic consumptionUnitLogic;
        public UnitController(ConsumptionUnitLogic consumptionUnitLogic)
        {
            this.consumptionUnitLogic = consumptionUnitLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(string unitName = null)
        {
            var data = consumptionUnitLogic.GetAllConsumptionUnit(unitName);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = consumptionUnitLogic.GetConsumptionUnitByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(ConsumptionUnitViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!consumptionUnitLogic.IsUniqueConsumptionUnit(model.ConsumptionUnitName.Trim()))
                return BadRequest(model.ConsumptionUnitName + " already exists!");

            consumptionUnitLogic.CreateConsumptionUnit(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(ConsumptionUnitViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!consumptionUnitLogic.IsUniqueConsumptionUnit(model.ConsumptionUnitName.Trim(), model.ConsumptionUnitID))
                return BadRequest(model.ConsumptionUnitName + " already exists!");

            consumptionUnitLogic.UpdateConsumptionUnit(model);
            return Ok(model);
        }
    }
}
