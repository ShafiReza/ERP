using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class TaxController : ApiController
    {
        private TaxService taxService;

        public TaxController(TaxService _taxService)
        {
            this.taxService = _taxService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = taxService.GetAll();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(TaxViewModel taxVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if(taxService.isExists(taxVM))
                return BadRequest("Duplicate Data!");

            taxService.SaveTax(taxVM, User.Identity.Name);
            return Ok(taxService);
        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(TaxViewModel taxVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (taxService.isExists(taxVM))
                return BadRequest("Duplicate Data!");

            taxService.Update(taxVM, User.Identity.Name);
            return Ok(taxService);
        }
    }
}
