using ScopoERP.Core.Finance.Services;
using ScopoERP.Core.Finance.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class CostCenterController : ApiController
    {
        private CostCenterLogic costCenterLogic;
        public CostCenterController(CostCenterLogic costCenterLogic)
        {
            this.costCenterLogic = costCenterLogic;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = costCenterLogic.GetAllCostCenter();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = costCenterLogic.GetByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(CostCenterViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!costCenterLogic.IsUnique(model))
                return BadRequest(model.CostCenterName + " already exists!");

            model.UserID = User.Identity.Name;

            costCenterLogic.SaveCostCenter(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(CostCenterViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!costCenterLogic.IsUnique(model))
                return BadRequest(model.CostCenterName + " already exists!");

            costCenterLogic.UpdateCostCenter(model);
            return Ok(model);
        }
    }
}
