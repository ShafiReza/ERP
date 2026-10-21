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
    public class ExportInvoiceController : ApiController
    {
        private ExportInvoiceLogic exportInvoiceLogic;

        public ExportInvoiceController(ExportInvoiceLogic exportInvoiceLogic)
        {
            this.exportInvoiceLogic = exportInvoiceLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex, int pageSize, bool excelExport, int? jobId = null, int? invoiceId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = exportInvoiceLogic.GetAllExportInvoice(pageIndex, pageSize, excelExport, jobId, invoiceId, fromDate, toDate);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = exportInvoiceLogic.GetExportInvoiceByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(ExportInvoiceViewModel exportInvoiceVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!exportInvoiceLogic.IsUniqueInvoiceNo(exportInvoiceVM.InvoiceNo.Trim()))
                return BadRequest("Invoice No Already Exists!");

            exportInvoiceLogic.CreateExportInvoice(exportInvoiceVM);
            return Ok(exportInvoiceVM);
        }

        [HttpPut]
        public IHttpActionResult Put(ExportInvoiceViewModel exportInvoiceVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!exportInvoiceLogic.IsUniqueInvoiceNo(exportInvoiceVM.InvoiceNo.Trim(), exportInvoiceVM.InvoiceId))
                return BadRequest("Invoice No Already Exists!");

            exportInvoiceLogic.UpdateExportInvoice(exportInvoiceVM);
            return Ok(exportInvoiceVM);
        }
    }
}
