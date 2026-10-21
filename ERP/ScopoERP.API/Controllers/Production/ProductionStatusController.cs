using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Production.BLL;
using ScopoERP.Production.ViewModel;
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
    [RoutePrefix("api/ProductionStatus")]
    public class ProductionStatusController : ApiController
    {
        private ProductionStatusLogic productionStatusLogic;
        public ProductionStatusController(ProductionStatusLogic productionStatusLogic)
        {
            this.productionStatusLogic = productionStatusLogic;

        }

        [HttpGet]
        public IHttpActionResult Get(DateTime? productionDate = null, int? purchaseOrderId = null, string floor = null)
        {
            var data = productionStatusLogic.GetAllProductionStatus(productionDate, purchaseOrderId, floor);

            if (data == null) return NotFound();

            return Ok(data);
        }


        [HttpPost]
        public IHttpActionResult Post(DailyProductionStatusViewModel productionStatusVm)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            productionStatusLogic.SaveProductionStatus(productionStatusVm);
            return Ok(true);
        }

  

        [HttpDelete]
        public IHttpActionResult Delete(int DailyProductionStatusId)
        {
            productionStatusLogic.DeleteProductionStatus(DailyProductionStatusId);
            return Ok(true);
        }

 

    
    }
}
