using ScopoERP.Commercial.ViewModel;
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
    [RoutePrefix("api/Job")]
    public class JobController : ApiController
    {
        private JobLogic jobLogic;

        public JobController(JobLogic jobLogic)
        {
            this.jobLogic = jobLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? jobId = null)
        {
            var data = jobLogic.GetAllJob(jobId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = jobLogic.GetJobByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Create(JobViewModel jobVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!jobLogic.IsUniqueJob(jobVM.JobNo)) 
                return BadRequest("Job No already exists!");

            jobLogic.CreateJob(jobVM, User.Identity.Name);
            return Ok(jobVM);
        }

        [HttpPut]
        public IHttpActionResult Update(JobViewModel jobVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (!jobLogic.IsUniqueJob(jobVM.JobNo, jobVM.JobId))
                return BadRequest("Job No already exists!");

            jobLogic.UpdateJob(jobVM);
            return Ok(jobVM);
        }

        [Route("GetJobBudget")]
        [HttpGet]
        public IHttpActionResult GetJobBudgetReport(int? jobId = null)
        {
            var data = jobLogic.GetJobBudgetReport(jobId);
            return Ok(data);
        }
    }
}
