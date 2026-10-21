using ScopoERP.Stackholder.BLL;
using ScopoERP.Stackholder.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Settings
{
    [Authorize]
    public class CustomerController : ApiController
    {
        private CustomerLogic customerLogic;
        public CustomerController(CustomerLogic customerLogic)
        {
            this.customerLogic = customerLogic;
        }
        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = customerLogic.GetAllCustomer();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            var data = customerLogic.GetCustomerByID(id);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(CustomerViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (customerLogic.IsUniqueCustomer(model.CustomerName.Trim(), model.CustomerID))
                return BadRequest(model.CustomerName + " already exists!");

            customerLogic.CreateCustomer(model);
            return Ok(model);
        }

        [HttpPut]
        public IHttpActionResult Put(CustomerViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (customerLogic.IsUniqueCustomer(model.CustomerName.Trim(), model.CustomerID))
                return BadRequest(model.CustomerName + " already exists!");

            customerLogic.UpdateCustomer(model);
            return Ok(model);
        }
    }
}
