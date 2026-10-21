using ScopoERP.Core.Finance.Services;
using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Accounts
{
    [Authorize]
    public class TransactionsController : ApiController
    {
        private TransactionLogic transactionLogic;

        public TransactionsController(TransactionLogic transactionLogic)
        {
            this.transactionLogic = transactionLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int year, int month, int? branchId = null, int? voucherType = null)
        {
            var data = transactionLogic.GetAllTransactions(year, month, branchId, voucherType);

            if(data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = transactionLogic.GetTransactionById(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(TransactionViewModel transactionVM)
        {
            if (!transactionLogic.isValidDrCrAmount(transactionVM.TransactionDetailList))
                return BadRequest("Please insert Dr Cr amount which is greater than zero");

            if (!transactionLogic.IsDrCrAmountEqual(transactionVM.TransactionDetailList))
                return BadRequest("Total Dr and Cr Amount Mismatch");

            //transactionVM.BranchID = transactionVM.CostCenterID;
            transactionVM.CreatedBy = User.Identity.Name;

            if (transactionVM.TransactionID == 0)
                transactionLogic.VoucherEntry(transactionVM);
            else
                transactionLogic.VoucherEdit(transactionVM);

            return Ok(transactionVM);
        }

        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            transactionLogic.VoucherDelete(id);

            return Ok();
        }
    }
}
