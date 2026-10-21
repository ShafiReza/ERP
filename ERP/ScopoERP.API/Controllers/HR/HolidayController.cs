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
    public class HolidayController : ApiController
    {
        HolidayService _holidayService;
        public HolidayController(HolidayService holidayService)
        {
            this._holidayService = holidayService;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, bool excelExport = false, string title = null)
        {
            var data = _holidayService.GetAll(pageIndex, pageSize, excelExport, title);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(HolidayViewModel HolidayVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (_holidayService.IsUnique(HolidayVM) == false) return BadRequest("Holiday already exists.");

            var data = _holidayService.Create(HolidayVM);
            return Ok(data);
        }

        // PUT: api/Holiday/5
        [HttpPut]
        public IHttpActionResult Put(HolidayViewModel HolidayVM)
        {
            if (!ModelState.IsValid) return BadRequest();
            _holidayService.Update(HolidayVM);
            return Ok(HolidayVM);
        }

        // DELETE: api/Holiday/5
        public void Delete(int id)
        {
        }
    }
}
