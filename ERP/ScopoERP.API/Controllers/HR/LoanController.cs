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
    public class LoanController : ApiController
    {
        private LoanService loanService;

        public LoanController(LoanService _loanService)
        {
            this.loanService = _loanService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = loanService.GetAllLoans();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(LoanVIewModel loanVM)
        {
            if (!ModelState.IsValid) return BadRequest();


            loanService.SaveLoan(loanVM, User.Identity.Name);
            return Ok(loanVM);
        }

    }
}
