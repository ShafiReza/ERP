using ScopoERP.MaterialManagement.BLL;
using ScopoERP.OrderManagement.BLL;
using ScopoERP.Production.BLL;
using ScopoERP.ProductionStatus.BLL;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Production
{
    [Authorize]
    public class LinePlanningController : ApiController
    {
        private ProductionPlanningLogic productionPlanningLogic;
        public PurchaseOrderLogic purchaseOrderLogic;  
        public BookingLogic bookingLogic;
        public ProductionStatusLogic productionStatusLogic;
        public LinePlanningController(ProductionPlanningLogic productionPlanningLogic, PurchaseOrderLogic purchaseOrderLogic, 
            BookingLogic bookingLogic, ProductionStatusLogic productionStatusLogic)
        {
            this.productionPlanningLogic = productionPlanningLogic;
            this.purchaseOrderLogic = purchaseOrderLogic;
            this.bookingLogic = bookingLogic;
            this.productionStatusLogic = productionStatusLogic;
        }

        [HttpGet]
        public IHttpActionResult GetAll()
        {
            var data = productionPlanningLogic.GetAll();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(List<ProductionPlanViewModel> plans)
        {
            productionPlanningLogic.Save(plans);

            return Ok();
        }

    }
}
