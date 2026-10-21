using ScopoERP.Core.Merchant.Services;
using ScopoERP.Core.Merchant.ViewModels;
using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Merchant
{
    public class ExcessBookingController : ApiController
    {
        private ExcessBookingLogic excessbookingLogic;

        public ExcessBookingController(ExcessBookingLogic excessbookingLogic)
        {
            this.excessbookingLogic = excessbookingLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, int? piId = null, int? jobId = null)
        {
            var data = excessbookingLogic.GetAllExcessBookings(pageIndex, pageSize,piId, jobId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPut]
        public IHttpActionResult Put(ExcessBookingViewModel viewModel)
        {
            if (!ModelState.IsValid) return BadRequest();
            excessbookingLogic.UpdateExcessBooking(viewModel);

            return Ok();
        }

        [HttpPost]
        public IHttpActionResult Post(ExcessBookingViewModel viewModel)
        {
            if (!ModelState.IsValid) return BadRequest();
            excessbookingLogic.SaveExcessBooking(viewModel);

            return Ok();
        }

        //[HttpDelete]
        //public IHttpActionResult Delete(int id)
        //{
        //    bookingLogic.DeleteBooking(id);

        //    return Ok();
        //}
    }
}
