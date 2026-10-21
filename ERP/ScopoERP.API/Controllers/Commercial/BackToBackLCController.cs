using ScopoERP.Commercial.BLL;
using ScopoERP.Commercial.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Commercial
{
    [Authorize]
    [RoutePrefix("api/BackToBackLC")]
    public class BackToBackLCController : ApiController
    {
        private BackToBackLCLogic backToBackLCLogic;

        public BackToBackLCController(BackToBackLCLogic backToBackLCLogic)
        {
            this.backToBackLCLogic = backToBackLCLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex, int pageSize, bool excelExport, 
            int? jobId = null, int? b2bLCId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = backToBackLCLogic.GetAllBackToBackLC(pageIndex, pageSize, excelExport, jobId, b2bLCId, fromDate, toDate);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = backToBackLCLogic.GetBackToBackLCByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBackToBackLCHistory")]
        [HttpGet]
        public IHttpActionResult GetBackToBackLCHistory(int blcId)
        {
            var data = backToBackLCLogic.GetBackToBackLCHistory(blcId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BackToBackLCViewModel backToBackLCVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!backToBackLCLogic.IsUniqueBackToBackLC(backToBackLCVM.BackToBackLCNo)) 
            {
                return BadRequest("BackToBackLCNo already exists.");
            }

            backToBackLCLogic.CreateBackToBackLC(backToBackLCVM);
            return Ok(backToBackLCVM);
        }

        [HttpPut]
        public IHttpActionResult Put(BackToBackLCViewModel backToBackLCVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            backToBackLCLogic.UpdateBackToBackLC(backToBackLCVM);
            return Ok(backToBackLCVM);
        }

        [Route("GetPIValue")]
        [HttpGet]
        public IHttpActionResult GetPIValue(int piID)
        {
            var data = backToBackLCLogic.GetPIValueByID(piID);

            return Ok(data);
        }
    }
}
