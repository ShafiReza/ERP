using ScopoERP.Core.Finance.Services;
using ScopoERP.Core.Finance.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Accounts
{
    [Authorize]
    public class SubsidiaryAccountsController : ApiController
    {
        private SubsidiaryAccountLogic subsidiaryAccountLogic;

        public SubsidiaryAccountsController(SubsidiaryAccountLogic subsidiaryAccountLogic)
        {
            this.subsidiaryAccountLogic = subsidiaryAccountLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(bool excelExport, int pageIndex = 1, int pageSize = 10, int? accountId=null, int? accountTypeId = null, int? parentAccountId = null)
        {
            var data = subsidiaryAccountLogic.GetAllAccount(pageIndex,pageSize,excelExport, accountId, accountTypeId, parentAccountId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = subsidiaryAccountLogic.GetByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(SubsidiaryAccountViewModel subsidiaryAccountVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            subsidiaryAccountLogic.Insert(subsidiaryAccountVM);
            return Ok(subsidiaryAccountVM);
        }

        [HttpPut]
        public IHttpActionResult Put(SubsidiaryAccountViewModel subsidiaryAccountVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            subsidiaryAccountLogic.Update(subsidiaryAccountVM);
            return Ok(subsidiaryAccountVM);
        }
    }
}
