using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class ManpowerBudgetController : ApiController
    {
        private ManPowerBudgetService manPowerBudgetService;

        public ManpowerBudgetController(ManPowerBudgetService _manPowerBudgetService)
        {
            manPowerBudgetService = _manPowerBudgetService;
        }
 
        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10,string floor = null,int? sectionId = null)
        {
            var data = manPowerBudgetService.GetAllSectionBudgets(pageIndex, pageSize, floor, sectionId);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            return Ok();
        }

        [HttpPost]
        public IHttpActionResult Post(SectionBudgetViewModel sectionBudgetVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            manPowerBudgetService.CreateSectionBudget(sectionBudgetVM);
            return Ok(sectionBudgetVM);
        }

        [HttpPut]
        public IHttpActionResult Put(SectionBudgetViewModel sectionBudgetVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            manPowerBudgetService.UpdateSectionBudget(sectionBudgetVM);
            return Ok(sectionBudgetVM);
        }
    }
}
