using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System.Linq;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class ItemController : ApiController
    {
        private ItemLogic itemLogic;
        public ItemController(ItemLogic itemLogic)
        {
            this.itemLogic = itemLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(string itemCode = null,int? categoryId = null, int? itemId = null)
        {
            var data = itemLogic.GetAllItem(itemCode,categoryId, itemId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = itemLogic.GetItemByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("Item/GetByCode")]
        [HttpGet]
        public IHttpActionResult GetByCode(string itemCode)
        {
            var data = itemLogic.GetItemByCode(itemCode);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(ItemViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!itemLogic.IsUniqueItem(model.ItemCode.Trim()))
                return BadRequest(model.ItemCode + " already exists!");

            itemLogic.CreateItem(model, User.Identity.Name);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(ItemViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!itemLogic.IsUniqueItem(model.ItemCode.Trim(), model.ItemID))
                return BadRequest(model.ItemCode + " already exists!");

            itemLogic.UpdateItem(model, User.Identity.Name);
            return Ok(model);
        }
    }
}
