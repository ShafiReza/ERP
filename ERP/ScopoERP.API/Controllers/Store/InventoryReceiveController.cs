using ScopoERP.Core.Store.Services;
using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using ScopoERP.Store.BLL;
using ScopoERP.Store.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Store
{
    [Authorize]
    [RoutePrefix("api/InventoryReceive")]
    public class InventoryReceiveController : ApiController
    {
        private InventoryReceiveLogic inventoryReceiveLogic;

        public InventoryReceiveController(InventoryReceiveLogic _inventoryReceiveLogic)
        {
            inventoryReceiveLogic = _inventoryReceiveLogic;
        }

        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, int? blId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = inventoryReceiveLogic.Get(pageIndex, pageSize, blId, fromDate, toDate);

            return Ok(data);
        }

        [Route("GetBookingDetails")]
        public IHttpActionResult GetDetailsById(int piId, int blId)
        {
            var data = inventoryReceiveLogic.GetById(piId, blId);

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(List<InventoryReceiveViewModel> VMList)
        {
            if (!ModelState.IsValid) return BadRequest();

            
            inventoryReceiveLogic.Save(VMList, User.Identity.Name);

            return Ok();
        }

    }
}