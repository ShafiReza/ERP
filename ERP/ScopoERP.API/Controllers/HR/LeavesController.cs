using ScopoERP.Core.HR.Services;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ScopoERP.Core.HR.ViewModels;

namespace ScopoERP.API.Controllers.HR
{
    [Authorize]
    [RoutePrefix("api/Leave")]
    public class LeavesController : ApiController
    {
        private LeaveService leaveService;

        public LeavesController(LeaveService _leaveService)
        {
            leaveService = _leaveService;
        }

        [HttpGet]
        public IHttpActionResult Get( int? employeeId = null)
        {
            var data = leaveService.GetAllLeaveApplication(employeeId);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            return Ok();
        }

        [HttpPost]
        public IHttpActionResult Post(LeaveApplicationViewModel leaveApplicationVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            leaveService.CreateLeaveApplication(leaveApplicationVM);
            return Ok(leaveApplicationVM);
        }

        [HttpPut]
        public IHttpActionResult Put(LeaveApplicationViewModel leaveApplicationVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            leaveService.UpdateLeaveApplication(leaveApplicationVM);
            return Ok(leaveApplicationVM);
        }

        [Route("GetLeaveBalance")]
        [HttpGet]
        public IHttpActionResult GetLeaveBalance(string cardNo)
        {
            return Ok(leaveService.GetLeaveBalance(cardNo));
        }
    }
}
