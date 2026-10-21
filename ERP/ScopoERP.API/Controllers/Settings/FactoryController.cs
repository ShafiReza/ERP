using ScopoERP.Common.BLL;
using ScopoERP.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class FactoryController : ApiController
    {
        private FactoryLogic factoryLogic;

        public FactoryController(FactoryLogic factoryLogic)
        {
            this.factoryLogic = factoryLogic;
        }
        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = factoryLogic.GetAllFactory();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = factoryLogic.GetFactoryByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(FactoryViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!factoryLogic.IsUniqueFactory(model.FactoryName.Trim()))
                return BadRequest(model.FactoryName + " already exists!");

            factoryLogic.CreateFactory(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(FactoryViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!factoryLogic.IsUniqueFactory(model.FactoryName.Trim(), model.FactoryID))
                return BadRequest(model.FactoryName + " already exists!");

            factoryLogic.UpdateFactory(model);
            return Ok(model);
        }
    }
}
