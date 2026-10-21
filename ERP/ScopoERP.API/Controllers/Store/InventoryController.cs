using ScopoERP.Core.Store.Services;
using ScopoERP.Core.Store.ViewModels;
using ScopoERP.Store.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Store
{
    [Authorize]
    [RoutePrefix("api/Inventory")]
    public class InventoryController : ApiController
    {
        private InventoryLogic inventoryLogic;

        public InventoryController(InventoryLogic _inventoryLogic)
        {
            inventoryLogic = _inventoryLogic;
        }

        public IHttpActionResult Get(int? styleId = null, int? poId = null, int? piId = null, int? blId = null)
        {
            if (styleId == null && poId == null && piId == null && blId == null)
                return BadRequest();

            var data = inventoryLogic.Get(styleId, poId, piId, blId);

            return Ok(data);
        }

        [Route("GetStockReport")]
        public IHttpActionResult GetStockReport(DateTime fromDate, DateTime toDate, int? itemCategoryId = null)
        {
            var data = inventoryLogic.GetStockReport(fromDate, toDate, itemCategoryId);

            return Ok(data);
        }
    }
}
