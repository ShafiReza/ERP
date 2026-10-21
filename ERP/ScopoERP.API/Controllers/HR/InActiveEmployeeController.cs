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
    public class InActiveEmployeeController : ApiController
    {
        private InActiveEmployeeService inActiveEmployeeService;

        public InActiveEmployeeController(InActiveEmployeeService employeeService)
        {
            this.inActiveEmployeeService = employeeService;
        }
        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10)
        {
            var data = inActiveEmployeeService.GetAll(pageIndex, pageSize);
            if (data == null) return NotFound();
            return Ok(data);
        }


        [HttpPost]
        public IHttpActionResult Post(InactiveEmployeeViewModel inActiveEmVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            var data = inActiveEmployeeService.SaveInactiveEmployeeInfo(inActiveEmVM, User.Identity.Name);
            return Ok(data);
        }

    }
}
