using ScopoERP.Production.BLL;
using ScopoERP.Production.ViewModel;
using ScopoERP.Stackholder.BLL;
using ScopoERP.Stackholder.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class ProductionFloorsController : ApiController
    {
        private ProductionFloorLogic floorLogic;
        public ProductionFloorsController(ProductionFloorLogic floorLogic)
        {
            this.floorLogic = floorLogic;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = floorLogic.GetAllProductionFloor();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = floorLogic.GetProductionFloorByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(ProductionFloorViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!floorLogic.IsUniqueProductionFloor(model.Floor.Trim(), model.Line.Trim(), model.ProductionFloorID))
                return BadRequest(model.Floor + "-" + model.Line + " already exists!");

            floorLogic.CreateProductionFloor(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(ProductionFloorViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!floorLogic.IsUniqueProductionFloor(model.Floor.Trim(), model.Line.Trim(), model.ProductionFloorID))
                return BadRequest(model.Floor + "-" + model.Line + " already exists!");

            floorLogic.UpdateProductionFloor(model);
            return Ok(model);
        }
    }
}
