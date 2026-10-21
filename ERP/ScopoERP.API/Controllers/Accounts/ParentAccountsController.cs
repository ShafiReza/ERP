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
    public class ParentAccountsController : ApiController
    {
        private ParentAccountLogic parentAccountLogic;

        public ParentAccountsController(ParentAccountLogic parentAccountLogic)
        {
            this.parentAccountLogic = parentAccountLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? accountType = null, int? accountId = null)
        {
            var data = parentAccountLogic.GetAllParentAccount(accountType, accountId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = parentAccountLogic.GetById(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(ParentAccountViewModel parentAccountVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            parentAccountLogic.Insert(parentAccountVM);
            return Ok(parentAccountVM);
        }

        [HttpPut]
        public IHttpActionResult Put(ParentAccountViewModel parentAccountVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            parentAccountLogic.Update(parentAccountVM);
            return Ok(parentAccountVM);
        }
    }
}
