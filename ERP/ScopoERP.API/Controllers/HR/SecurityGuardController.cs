using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Reports.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class SecurityGuardController : ApiController
    {
        private SecurityGuardRosterService securityGuardService;

        public SecurityGuardController(SecurityGuardRosterService _securityGuardService)
        {
            this.securityGuardService = _securityGuardService;
        }

        [HttpGet]
        public IHttpActionResult Get(DateTime date)
        {
            var data = securityGuardService.SearchRoster(date);

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(List<SecurityGuardRosterViewModel> roster)
        {
            if (!ModelState.IsValid) return BadRequest();

            securityGuardService.SaveRoster(roster, User.Identity.Name);
            return Ok(roster);
        }

    }
}