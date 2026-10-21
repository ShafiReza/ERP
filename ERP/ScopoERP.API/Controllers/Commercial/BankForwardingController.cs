using ScopoERP.Commercial.BankForwardingL;
using ScopoERP.Commercial.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Commercial
{
    [Authorize]
    public class BankForwardingController : ApiController
    {
        private BankForwardingLogic bankForwardingLogic;

        public BankForwardingController(BankForwardingLogic bankForwardingLogic)
        {
            this.bankForwardingLogic = bankForwardingLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? jobId = null, int? bankForwardingId = null)
        {
            var data = bankForwardingLogic.GetAllBankForwarding(jobId, bankForwardingId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = bankForwardingLogic.GetBankForwardingByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BankForwardingViewModel bankForwardingVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            int userId = 1; // temp

            bankForwardingLogic.CreateBankForwarding(bankForwardingVM, userId);
            return Ok(bankForwardingVM);
        }

        [HttpPut]
        public IHttpActionResult Put(BankForwardingViewModel bankForwardingVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            bankForwardingLogic.UpdateBankForwarding(bankForwardingVM);
            return Ok(bankForwardingVM);
        }
    }
}
