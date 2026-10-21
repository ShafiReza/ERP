using ScopoERP.Finance.BLL;
using ScopoERP.Finance.ViewModel;
using ScopoERP.LC.BLL;
using ScopoERP.LC.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Commercial
{
    [Authorize]
    public class RealizationController : ApiController
    {
        private RealizationLogic realizationLogic;

        public RealizationController(RealizationLogic realizationLogic)
        {
            this.realizationLogic = realizationLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(bool excelExport, int pageIndex = 1, int pageSize = 10, int? bankforwardingId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = realizationLogic.GetAllRealization( pageIndex, pageSize, excelExport, bankforwardingId, fromDate, toDate);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = realizationLogic.GetRealizationById(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Create(RealizationViewModel realizationVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            realizationLogic.Create(realizationVM);
            return Ok(realizationVM);
        }

        [HttpPut]
        public IHttpActionResult Update(RealizationViewModel realizationVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            realizationLogic.Update(realizationVM);
            return Ok(realizationVM);
        }
    }
}
