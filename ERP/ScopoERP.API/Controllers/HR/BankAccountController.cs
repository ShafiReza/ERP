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
    public class BankAccountController : ApiController
    {
        private BankAccountService bankService;

        public BankAccountController(BankAccountService _bankService)
        {
            this.bankService = _bankService;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, bool excelExport = false, int? bankAccountId = null)
        {
            var data = bankService.GetAllBankAccount(pageIndex, pageSize, excelExport, bankAccountId);

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(BankSalaryViewModel bsVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (bankService.IsUniqueAccount(bsVM.EmployeeID, bsVM.BankName))
            {
                return BadRequest("Account Already Exists");
            }

            var data = bankService.Save(bsVM);
            return Ok(data);
        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(BankSalaryViewModel bsVM)
        {
            if (!ModelState.IsValid) return BadRequest();
            bankService.Update(bsVM);
            return Ok(bsVM);
        }


    }
}
