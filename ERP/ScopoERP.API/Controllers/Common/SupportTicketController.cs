using ScopoERP.API.Common.Services;
using ScopoERP.API.Common.ViewModels;
using System;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Common
{
    [Authorize]
    public class SupportTicketController : ApiController
    {
        private SupportTicketLogic supportticketlogic;

        public SupportTicketController(SupportTicketLogic supportticketlogic)
        {
            this.supportticketlogic = supportticketlogic;
        }

        [HttpGet]
        public IHttpActionResult Get(DateTime fromDate, DateTime toDate, string assignTo)
        {
            if(String.IsNullOrEmpty(assignTo)) assignTo = User.Identity.Name;

            var data = supportticketlogic.GetAllSupportTickets(fromDate, toDate, assignTo);

            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(SupportTicketViewModel supportticketVM)
        {
            supportticketVM.CreatedBy = User.Identity.Name;
            supportticketVM.CreatedDate = DateTime.Now;
            supportticketVM.AssignTo = User.Identity.Name;

            if (!ModelState.IsValid) return BadRequest();
            
            supportticketlogic.CreateSupportTicket(supportticketVM);
            return Ok(supportticketVM);
        }

        [HttpPut]
        public IHttpActionResult Put(SupportTicketViewModel supportticketVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            supportticketlogic.UpdateSupportTicket(supportticketVM);
            return Ok(supportticketVM);
        }
    }
}
