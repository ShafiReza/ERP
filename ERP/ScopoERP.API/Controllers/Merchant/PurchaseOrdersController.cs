using ScopoERP.OrderManagement.BLL;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Sales
{
    [Authorize]
    [RoutePrefix("api/PurchaseOrders")]
    public class PurchaseOrdersController : ApiController
    {
        private PurchaseOrderLogic purchaseOrderLogic;
        private SizeColorLogic sizeColorLogic;

        public PurchaseOrdersController(PurchaseOrderLogic purchaseOrderLogic, SizeColorLogic sizeColorLogic)
        {
            this.purchaseOrderLogic = purchaseOrderLogic;
            this.sizeColorLogic = sizeColorLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(string poNo= null,int? purchaseOrderId = null, int? styleId = null, int? factoryId = null, int? jobId = null,
            DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = purchaseOrderLogic.GetAllPurchaseOrder(poNo,purchaseOrderId, styleId, factoryId, jobId, fromDate, toDate);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = purchaseOrderLogic.GetPurchaseOrderByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(PurchaseOrderViewModel purchaseOrderVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            purchaseOrderLogic.CreatePurchaseOrder(purchaseOrderVM);
            return Ok(purchaseOrderVM);
        }

        [HttpPut]
        public IHttpActionResult Put(PurchaseOrderViewModel purchaseOrderVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            purchaseOrderLogic.UpdatePurchaseOrder(purchaseOrderVM);
            return Ok(purchaseOrderVM);
        }

        [Route("GetSizeColor")]
        [HttpGet]
        public IHttpActionResult GetSizeColor(int purchaseOrderId)
        {
            var data = sizeColorLogic.GetSizeColor(purchaseOrderId);
            return Ok(data);
        }

        [Route("SaveSizeColor")]
        [HttpPost]
        public IHttpActionResult SaveSizeColor(List<SizeColorViewModel> model)
        {
            sizeColorLogic.SaveSizeColor(model);
            return Ok(model);
        }
    }
}
