using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System.Collections.Generic;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Sales
{
    [Authorize]
    public class BookingsController : ApiController
    {
        private BookingLogic bookingLogic;

        public BookingsController(BookingLogic bookingLogic)
        {
            this.bookingLogic = bookingLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? piId = null, int? supplierId = null)
        {
            var data = bookingLogic.GetBookings(piId, supplierId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = bookingLogic.GetBookingDetails(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BookingEntryViewModel viewModel)
        {
            if(!ModelState.IsValid) return BadRequest();

            viewModel.PI.ModifiedBy = User.Identity.Name;
            bookingLogic.SaveBooking(viewModel);

            return Ok();
        }

        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            bookingLogic.DeleteBooking(id);

            return Ok();
        }
    }
}
