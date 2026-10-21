using ScopoERP.ProductionStatus.BLL;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class JobClassController : ApiController
    {
        private JobClassLogic jobClassLogic;
        public JobClassController(JobClassLogic jobClassLogic)
        {
            this.jobClassLogic = jobClassLogic;
        }
        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = jobClassLogic.GetAllJobClassList();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = jobClassLogic.GetJobClassDetailByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(JobClassViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!jobClassLogic.IsUnique(model))
                return BadRequest(model.JobClassName + " already exists!");

            jobClassLogic.Create(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(JobClassViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!jobClassLogic.IsUnique(model))
                return BadRequest(model.JobClassName + " already exists!");

            jobClassLogic.Update(model);
            return Ok(model);
        }
    }
}
