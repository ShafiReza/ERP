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
    public class ImportInvoiceController : ApiController
    {
        private BLLogic blLogic;

        public ImportInvoiceController(BLLogic blLogic)
        {
            this.blLogic = blLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? jobId = null, int? b2bLCId = null, int? blId = null, string invoiceNo = null)
        {
            var data = blLogic.GetAllBL(jobId, b2bLCId, blId, invoiceNo);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = blLogic.GetBLByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BLViewModel blVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!blLogic.IsUniqueBL(blVM.BLNo))
                return BadRequest("BL No already exists!");

            blLogic.CreateBL(blVM);
            return Ok(blVM);
        }

        [HttpPut]
        public IHttpActionResult Put(BLViewModel blVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!blLogic.IsUniqueBL(blVM.BLNo, blVM.BLID))
                return BadRequest("BL No already exists!");

            blLogic.UpdateBL(blVM);
            return Ok(blVM);
        }
    }
}
