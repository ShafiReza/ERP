using ScopoERP.MaterialManagement.BLL;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class ItemCategoryController : ApiController
    {
        private ItemCategoryLogic itemCategoryLogic;

        public ItemCategoryController(ItemCategoryLogic itemCategoryLogic)
        {
            this.itemCategoryLogic = itemCategoryLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int? itemCategoryId = null)
        {
            var data = itemCategoryLogic.GetAllItemCategory(itemCategoryId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = itemCategoryLogic.GetItemCategoryByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(ItemCategoryViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!itemCategoryLogic.IsUniqueItemCategory(model.Name))
                return BadRequest(model.Name + " already exists!");

            itemCategoryLogic.CreateItemCategory(model, User.Identity.Name);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(ItemCategoryViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!itemCategoryLogic.IsUniqueItemCategory(model.Name, model.ItemCategoryID))
                return BadRequest(model.Name + " already exists!");

            itemCategoryLogic.UpdateItemCategory(model, User.Identity.Name);
            return Ok(model);
        }
    }
}
