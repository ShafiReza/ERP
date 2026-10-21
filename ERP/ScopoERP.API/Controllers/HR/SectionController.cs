using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.OrderManagement.BLL;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class SectionController : ApiController
    {
        private SectionService sectionService;

        public SectionController(SectionService sectionService)
        {
            this.sectionService = sectionService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = sectionService.GetAll();
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(SectionViewModel sectionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            sectionService.CreateSection(sectionVM);
            return Ok(sectionVM);
        }

        [HttpPut]
        public IHttpActionResult Put(SectionViewModel sectionVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            sectionService.UpdateSection(sectionVM);
            return Ok(sectionVM);
        }

        [HttpDelete]
        public IHttpActionResult Delete(SectionViewModel sectionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            sectionService.DeleteSection(sectionVM);
            return Ok(sectionVM);
        }
    }
}