using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers.HR
{
    public class MedicineController : ApiController
    {
        private MedicineService medService;

        public MedicineController(MedicineService _medService)
        {
            this.medService = _medService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = medService.GetAllMedicines();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(MedicineViewModel medVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (medService.IsUnique(medVM))
            {
                medService.CreateMedicine(medVM, User.Identity.Name);
                return Ok(medVM);
            }
            else
            {
                return BadRequest("Duplicate Data!");

            }


        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(MedicineViewModel medVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (medService.IsUnique(medVM))
            {
                medService.UpdateMedicine(medVM, User.Identity.Name);
                return Ok(medVM);
            }
            else
            {
                return BadRequest("Duplicate Data!");

            }
        }
    }
}
