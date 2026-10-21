using ScopoERP.ProductionStatus.BLL;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class OperationController : ApiController
    {
        private StandardOperationLogic standardOperationLogic;
        public OperationController(StandardOperationLogic standardOperationLogic)
        {
            this.standardOperationLogic = standardOperationLogic;
        }

        [HttpPost]
        public IHttpActionResult Post(StandardOperationViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!standardOperationLogic.IsUniqueOperation(model))
                return BadRequest(model.OperationName + " or " + model.OperationCodeNo + " already exists!");

            model = standardOperationLogic.SaveStandardOperation(model);
            return Ok(model);
        }

        [HttpGet]
        public IHttpActionResult Get(int? operationId = null, int? operationCategoryId = null, int? jobClassId = null)
        {
            var data = standardOperationLogic.GetAllStandardOperations(operationId, operationCategoryId, jobClassId);

            if (data == null) return NotFound();

            return Ok(data);
        }
    }
}
