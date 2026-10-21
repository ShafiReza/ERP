using ScopoERP.Commercial.ViewModel;
using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models.HR;
using ScopoERP.LC.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    [Authorize]
    public class SpecialShiftController : ApiController
    {
        private SpecialShiftService specialShiftService;

        public SpecialShiftController(SpecialShiftService _SpecialShiftService)
        {
            this.specialShiftService = _SpecialShiftService;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var data = specialShiftService.GetAllSpecialShift(pageIndex, pageSize, fromDate, toDate);

            if (data == null) return NotFound();

            return Ok(data);
        }



        [HttpPost]
        public IHttpActionResult Create(SpecialShiftViewModel specialShiftVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            specialShiftService.Create(specialShiftVM);
            return Ok(specialShiftVM);
        }

        [HttpPut]
        public IHttpActionResult Update(SpecialShiftViewModel specialShiftVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            specialShiftService.Update(specialShiftVM);
            return Ok(specialShiftVM);
        }
    }
}