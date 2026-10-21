using Microsoft.AspNet.Identity;
using ScopoERP.Core.Merchant.Services;
using ScopoERP.Core.Merchant.ViewModels;
using ScopoERP.Core.Purchase.ViewModels;
using ScopoERP.OrderManagement.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Merchant
{
    [Authorize]
    public class MerchantRequisitionController : ApiController
    {
        private MerchantRequisitionLogic merchantRequisitionLogic;

        public MerchantRequisitionController(MerchantRequisitionLogic _merchantRequisitionLogic)
        {
            this.merchantRequisitionLogic = _merchantRequisitionLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(bool excelExport, int pageIndex = 1, int pageSize = 10, int? jobId = null)
        {
            var data = merchantRequisitionLogic.GetAllRequisition(pageIndex, pageSize, excelExport, jobId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = merchantRequisitionLogic.GetRequisitionByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(RequisitionViewModel requisitionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            requisitionVM.UserID = 1;
            var res = merchantRequisitionLogic.CreateRequisition(requisitionVM);

            return Ok(res);
        }

        [HttpPut]
        public IHttpActionResult Put(RequisitionViewModel requisitionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            requisitionVM.UserID = 1;
            var res = merchantRequisitionLogic.UpdateRequisition(requisitionVM);

            return Ok(res);
        }

    }
}