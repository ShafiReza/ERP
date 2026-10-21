using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class RoasterSetupController : ApiController
    {
        private RoasterSetupService roasterSetupService;

        public RoasterSetupController(RoasterSetupService _roasterSetupService)
        {
            this.roasterSetupService = _roasterSetupService;
        }

        [HttpGet]
        public IHttpActionResult Get(DateTime FromDate, DateTime ToDate, string CardNo)
        {
            var data = roasterSetupService.GetRoaserList(FromDate, ToDate, CardNo);

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(RoasterSetupViewModel roasterSetupVM)
        {
            if (!ModelState.IsValid) return BadRequest();


            roasterSetupService.RoasterSetup(roasterSetupVM);
            return Ok(roasterSetupVM);
        }

        // DELETE: api/RoasterSetup/5
        public IHttpActionResult Delete(int id)
        {
            var data = roasterSetupService.DeleteRoaster(id);
            return Ok(data);
        }
    }
}
