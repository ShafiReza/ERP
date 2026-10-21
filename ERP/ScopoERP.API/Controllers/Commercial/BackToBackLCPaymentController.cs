using ScopoERP.Core.Commercial.Services;
using ScopoERP.Core.Commercial.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Commercial
{
    [Authorize]
    public class BackToBackLCPaymentController : ApiController
    {
        private BackToBackLCPaymentLogic backToBackLCPaymentLogic;

        public BackToBackLCPaymentController(BackToBackLCPaymentLogic backToBackLCPaymentLogic)
        {
            this.backToBackLCPaymentLogic = backToBackLCPaymentLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? backtobacklcid = null)
        {
            var data = backToBackLCPaymentLogic.GetAllBackToBackLCPayment(backtobacklcid);

            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BackToBackLCPaymentViewModel backTobackLcVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            backToBackLCPaymentLogic.CreateBackToBackLCPayment(backTobackLcVM);
            return Ok(backTobackLcVM);
        }

        [HttpPut]
        public IHttpActionResult Put(BackToBackLCPaymentViewModel backTobackLcVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            backToBackLCPaymentLogic.UpdateBackToBackLCPayment(backTobackLcVM);
            return Ok(backTobackLcVM);
        }
    }
}
