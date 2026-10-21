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
    public class LicenseController : ApiController
    {
        LicenseService _licenseService;
        public LicenseController(LicenseService licenseService)
        {
            this._licenseService = licenseService;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, bool excelExport = false, string title = null)
        {
            var data = _licenseService.GetAllLicenses();
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public IHttpActionResult Post(LicenseViewModel licenseVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            var data = _licenseService.CreateLicense(licenseVM, User.Identity.Name);
            return Ok(data);
        }

        // PUT: api/Holiday/5
        [HttpPut]
        public IHttpActionResult Put(LicenseViewModel licenseVM)
        {
            if (!ModelState.IsValid) return BadRequest();
            _licenseService.UpdateLicense(licenseVM, User.Identity.Name);
            return Ok(licenseVM);
        }
    }
}
