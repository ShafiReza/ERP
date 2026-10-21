using ScopoERP.Reports.BLL;
using System;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Accounts
{
    [Authorize]
    [RoutePrefix("api/AccountingReports")]
    public class AccountingReportsController : ApiController
    {
        private ReportLogic reportLogic;

        public AccountingReportsController(ReportLogic _reportLogic)
        {
            this.reportLogic = _reportLogic;
        }

        [Route("TrailBalance")]
        public IHttpActionResult TrailBalance(DateTime fromDate, DateTime toDate, int branchId)
        {
            var data = reportLogic.GetTrailBalanceData(fromDate, toDate, branchId);

            return Ok(data);
        }

        [Route("BalanceSheet")]
        public IHttpActionResult BalanceSheet(DateTime toDate, int branchId)
        {
            var data = reportLogic.GetBalanceSheetData(toDate, branchId);

            return Ok(data);
        }

        [Route("ProfitLosstStatement")]
        public IHttpActionResult ProfitLosstStatement( DateTime toDate, int branchId, DateTime? fromDate = null)
        {
            var data = reportLogic.GetIncomeStatementData(fromDate, toDate, branchId);

            return Ok(data);
        }

        [Route("Ledger")]
        public IHttpActionResult Ledger(DateTime? fromDate, DateTime toDate, int branchId, int accountId)
        {
            var data = reportLogic.GetLedgerReportData(fromDate, toDate, branchId, accountId);

            return Ok(data);
        }
    }
}
