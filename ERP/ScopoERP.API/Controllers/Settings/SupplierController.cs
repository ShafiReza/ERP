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
    public class SupplierController : ApiController
    {
        private SupplierLogic supplierLogic;

        public SupplierController(SupplierLogic supplierLogic)
        {
            this.supplierLogic = supplierLogic;
        }
        [HttpGet]
        public IHttpActionResult Get(bool excelExport, string supplierName = null, int pageIndex = 1, int pageSize = 10)
        {
            var data = supplierLogic.GetAllSupplier(excelExport,pageIndex, pageSize,supplierName);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = supplierLogic.GetSupplierByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(SupplierViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!supplierLogic.IsUniqueSupplier(model.SupplierName.Trim()))
                return BadRequest(model.SupplierName + " already exists!");

            supplierLogic.CreateSupplier(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(SupplierViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!supplierLogic.IsUniqueSupplier(model.SupplierName.Trim(), model.SupplierID))
                return BadRequest(model.SupplierName + " already exists!");

            supplierLogic.UpdateSupplier(model);
            return Ok(model);
        }
    }
}
