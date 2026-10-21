using ScopoERP.Commercial.ViewModel;
using ScopoERP.Core.Purchase;
using ScopoERP.Core.Purchase.ViewModels;
using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Purchase
{
    public class PurchaseRequisitionController : ApiController
    {
        private PurchaseRequisitionLogic requisitionLogic;

        public PurchaseRequisitionController(PurchaseRequisitionLogic _requisitionLogic)
        {
            this.requisitionLogic = _requisitionLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(bool excelExport, int pageIndex = 1, int pageSize = 10, int? requisitionId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = requisitionLogic.GetAllRequisition(pageIndex, pageSize, excelExport, requisitionId, fromDate, toDate);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = requisitionLogic.GetRequisitionByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(PurchaseRequisitionViewModel requisitionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            requisitionVM.UserID = User.Identity.Name;
            var res = requisitionLogic.CreateRequisition(requisitionVM);

            return Ok(res);
        }

        [HttpPut]
        public IHttpActionResult Put(PurchaseRequisitionViewModel requisitionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            requisitionVM.UserID = User.Identity.Name;
            requisitionLogic.UpdateRequisition(requisitionVM);

            return Ok();
        }


    }
}
