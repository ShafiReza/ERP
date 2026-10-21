using ScopoERP.LC.BLL;
using ScopoERP.LC.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class BankController : ApiController
    {
        private BankLogic bankLogic;

        public BankController(BankLogic bankLogic)
        {
            this.bankLogic = bankLogic;
        }
        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = bankLogic.GetAllBank();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = bankLogic.GetBankByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BankViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!bankLogic.IsUniqueBank(model.BankName.Trim()))
                return BadRequest(model.BankName + " already exists!");

            bankLogic.CreateBank(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(BankViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!bankLogic.IsUniqueBank(model.BankName.Trim(), model.BankID))
                return BadRequest(model.BankName + " already exists!");

            bankLogic.UpdateBank(model);
            return Ok(model);
        }
    }
}
