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
    public class FineController : ApiController
    {
        private FineService fineService;

        public FineController(FineService _fineService)
        {
            this.fineService = _fineService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = fineService.GetAll();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(FineViewModel fineVM)
        {
            if (!ModelState.IsValid) return BadRequest();


            fineService.SaveFine(fineVM, User.Identity.Name);
            return Ok(fineVM);
        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(FineViewModel fineVM)
        {
            if (!ModelState.IsValid) return BadRequest();


            fineService.Update(fineVM, User.Identity.Name);
            return Ok(fineVM);
        }
    }
}
