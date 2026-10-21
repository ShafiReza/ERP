using ScopoERP.ProductionStatus.BLL;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Production
{
    [Authorize]
    public class StyleOperationController : ApiController
    {
        private StyleOperationLogic styleOperationLogic;
        public StyleOperationController(StyleOperationLogic styleOperationLogic)
        {
            this.styleOperationLogic = styleOperationLogic;
        }


        [HttpPost]
        public IHttpActionResult SaveStyleOperation(List<StyleOperationViewModel> operationList)
        {
            if (!ModelState.IsValid || operationList is null || operationList.Count == 0) return BadRequest();

            styleOperationLogic.CreateStyleOperation(operationList);
            return Ok("Data Saved Successfully.");  
        }

        [HttpGet]
        public IHttpActionResult GetStyleOperationListByStyleID(int styleId, string floor, string line, string topOrBottom = null)
        {
            List<StyleOperationViewModel> styleOperationList = styleOperationLogic.GetStyleOperationListByStyleID(styleId, floor, line, topOrBottom);
            if (styleOperationList == null) return NotFound();
            return Ok(styleOperationList);
        }      

    }
}
