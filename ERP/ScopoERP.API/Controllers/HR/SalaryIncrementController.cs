using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Reports.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    [RoutePrefix("api/SalaryIncrement")]
    public class SalaryIncrementController : ApiController
    {
        SalaryIncrementService _salaryIncrementService;
        public SalaryIncrementController(SalaryIncrementService salaryIncrementService)
        {
            this._salaryIncrementService = salaryIncrementService;
        }

        [Route("GetSalaryIncrement")]
        [HttpPost]
        public IHttpActionResult GetSalaryIncrement(ReportFilteringViewModel siVM)
        {
            int branchId = 1;
            var data = _salaryIncrementService.GetSalaryIncrement(siVM, branchId);
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(List<IncrementReportViewModel> sIVM)
        {
            _salaryIncrementService.SaveSalaryIncrement(sIVM, User.Identity.Name);
            return Ok(sIVM);
        }


    }
}
