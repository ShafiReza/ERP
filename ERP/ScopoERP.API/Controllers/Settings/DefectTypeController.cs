using ScopoERP.Core.Settings.Services;
using ScopoERP.Core.Settings.ViewModels;
using ScopoERP.LC.BLL;
using ScopoERP.LC.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class DefectTypeController : ApiController
    {
        private DefectTypeService defectTypeService;

        public DefectTypeController(DefectTypeService _defectTypeService)
        {
            this.defectTypeService = _defectTypeService;
        }
        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = defectTypeService.GetAllDefectTypes();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(DefectTypeViewModel defectTypeVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            defectTypeService.CreateDefectType(defectTypeVM);
            return Ok(defectTypeVM);
        }

        [HttpPut]
        public IHttpActionResult Put(DefectTypeViewModel defectTypeVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            defectTypeService.UpdateDefectType(defectTypeVM);
            return Ok(defectTypeVM);
        }
    }
}