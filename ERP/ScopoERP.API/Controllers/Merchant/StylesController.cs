using ScopoERP.OrderManagement.BLL;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Sales
{
    [Authorize]
    public class StylesController : ApiController
    {
        private StyleLogic styleLogic;

        public StylesController(StyleLogic styleLogic)
        {
            this.styleLogic = styleLogic;
        }

        [HttpGet]
        public IHttpActionResult Get(int accountId, int? styleId = null, int? buyerId = null)
        {
            var data = styleLogic.GetAllStyle(accountId, styleId, buyerId);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = styleLogic.GetStyleByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(StyleViewModel styleVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            styleLogic.CreateStyle(styleVM);
            return Ok(styleVM);
        }

        [HttpPut]
        public IHttpActionResult Put(StyleViewModel styleVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            styleLogic.UpdateStyle(styleVM);
            return Ok(styleVM);
        }
    }
}
