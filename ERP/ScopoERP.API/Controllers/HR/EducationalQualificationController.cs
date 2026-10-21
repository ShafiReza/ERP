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
    public class EducationalQualificationController : ApiController
    {
        private EducationalQualificationService educationalQualificationService;

        public EducationalQualificationController(EducationalQualificationService _educationalQualificationService)
        {
            this.educationalQualificationService = _educationalQualificationService;
        }

        [HttpGet]
        public IHttpActionResult Get()
        {
            var data = educationalQualificationService.GetAllEducationQualification();

            return Ok(data);
        }


        // GET: api/BankAccount/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BankAccount
        [HttpPost]
        public IHttpActionResult Post(EducationalQualificationViewModel eQVm)
        {
            if (!ModelState.IsValid) return BadRequest();

            if (educationalQualificationService.IsUnique(eQVm))
            {
                educationalQualificationService.UpdateEducatiuonQualification(eQVm);
                return Ok(eQVm);
            }
            else
            {
                return BadRequest("Qualification already exists.");
            }

            
        }


    }
}
