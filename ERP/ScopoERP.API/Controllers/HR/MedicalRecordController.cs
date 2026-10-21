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
    public class MedicalRecordController : ApiController
    {
        private MedicalRecordService medService;

        public MedicalRecordController(MedicalRecordService _medService)
        {
            this.medService = _medService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = medService.GetAllRecord();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(MedicalRecordViewModel empVM)
        {
            if (!ModelState.IsValid) return BadRequest();

          
                medService.Create(empVM);
                return Ok(empVM);
         


        }

        // PUT: api/BankAccount/5
        [HttpPut]
        public IHttpActionResult Put(MedicalRecordViewModel empVM)
        {
            if (!ModelState.IsValid) return BadRequest();


            medService.Update(empVM);
            return Ok(empVM);
        }
    }
}
