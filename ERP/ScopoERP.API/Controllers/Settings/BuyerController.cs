using ScopoERP.Stackholder.BLL;
using ScopoERP.Stackholder.ViewModel;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class BuyerController : ApiController
    {
        private BuyerLogic buyerLogic;
        public BuyerController(BuyerLogic buyerLogic)
        {
            this.buyerLogic = buyerLogic;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = buyerLogic.GetAllBuyer();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = buyerLogic.GetBuyerByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(BuyerViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!buyerLogic.IsUniqueBuyer(model.BuyerName.Trim(), model.BuyerID))
                return BadRequest(model.BuyerName + " already exists!");

            buyerLogic.CreateBuyer(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(BuyerViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!buyerLogic.IsUniqueBuyer(model.BuyerName.Trim(), model.BuyerID))
                return BadRequest(model.BuyerName + " already exists!");

            buyerLogic.UpdateBuyer(model);
            return Ok(model);
        }
    }
}
