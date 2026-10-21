using ScopoERP.Core.Store.Services;
using ScopoERP.Core.Store.ViewModels;
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
    [RoutePrefix("api/InventoryIssue")]
    public class InventoryIssueController : ApiController
    {
     
        private InventoryIssueLogic issueLogic;

        public InventoryIssueController(InventoryIssueLogic _issueLogic)
        {
            this.issueLogic = _issueLogic;
        }

        public IHttpActionResult Get(bool excelExport,int pageIndex = 1, int pageSize = 10, int? srId = null, DateTime? fromDate = null, DateTime? toDate = null, string SRNo = null, int? poId=null)
        {
            var data = issueLogic.Get(pageIndex, pageSize, excelExport, fromDate, toDate, SRNo, poId);
            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int Id)
        {
            var data = issueLogic.GetByid(Id);

            return Ok(data);
        }

        [Route("GetByPo")]
        public IHttpActionResult GetByPoItem(int poId, int itemId)
        {
            var data = issueLogic.GetByPoItem(poId, itemId);
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(InventoryIssueViewModel VM)
        {
            if (!ModelState.IsValid) return BadRequest();


            issueLogic.Save(VM, User.Identity.Name);

            return Ok();
        }

        [HttpPut]
        public IHttpActionResult Put(InventoryIssueViewModel VM)
        {
            if (!ModelState.IsValid) return BadRequest();


            issueLogic.Update(VM);

            return Ok();
        }


    }
}