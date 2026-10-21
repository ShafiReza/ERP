using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class SecurityGuardHolidayController : ApiController
    {
        private SecurityGuardHolidayService holidayService;

        public SecurityGuardHolidayController(SecurityGuardHolidayService _holidayService)
        {
            this.holidayService = _holidayService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = holidayService.GetAll();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(SecurityGuardHolidayViewModel SecurityGuardHolidayVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            SecurityGuardHolidayVM.ModifiedBy = User.Identity.Name;
            var data = holidayService.Create(SecurityGuardHolidayVM);
            return Ok(data);
        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(SecurityGuardHolidayViewModel SecurityGuardHolidayVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            SecurityGuardHolidayVM.ModifiedBy = User.Identity.Name;
            holidayService.Update(SecurityGuardHolidayVM);
            return Ok(SecurityGuardHolidayVM);
        }
    }
}