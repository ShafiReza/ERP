using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System.Collections.Generic;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Sales
{
    [Authorize]
    public class CostsheetController : ApiController
    {
        private CostsheetLogic costsheetLogic;

        public CostsheetController(CostsheetLogic costsheetLogic)
        {
            this.costsheetLogic = costsheetLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int purchaseOrderId)
        {
            var data = costsheetLogic.GetCostSheet(purchaseOrderId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(List<CostsheetViewModel> models)
        {
            if(!ModelState.IsValid) return BadRequest();

            costsheetLogic.SaveCostsheet(models);

            return Ok(models);
        }

        [HttpDelete]
        public IHttpActionResult Delete(int costsheetId)
        {
            costsheetLogic.DeleteCostSheet(costsheetId);

            return Ok();
        }
    }
}
