using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class PrescriptionController : ApiController
    {
        private PrescriptionService prescriptionService;

        public PrescriptionController(PrescriptionService _prescriptionService)
        {
            this.prescriptionService = _prescriptionService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = prescriptionService.GetRecentPrescriptionList();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(PrescriptionViewModel prescriptionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            prescriptionVM.ModifiedBy = User.Identity.Name;
            prescriptionService.Create(prescriptionVM);
            return Ok(prescriptionVM);
        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(PrescriptionViewModel prescriptionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            prescriptionVM.ModifiedBy = User.Identity.Name;
            prescriptionService.Update(prescriptionVM);
            return Ok(prescriptionVM);
        }
    }
}
