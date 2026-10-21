using ScopoERP.Core.Production.Services;
using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Production.BLL;
using ScopoERP.Production.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Production
{
    public class DailyEarningController : ApiController
    {
        private DailyEarningLogic dailyEarningLogic;
        public DailyEarningController(DailyEarningLogic _dailyEarningLogic)
        {
            this.dailyEarningLogic = _dailyEarningLogic;

        }

        [HttpGet]
        public IHttpActionResult Get(DateTime? fromDate = null, DateTime? toDate = null, string floor = null)
        {
            var data = dailyEarningLogic.GetAllDailyEarning(fromDate, toDate, floor);

            if (data == null) return NotFound();

            return Ok(data);
        }


        [HttpPost]
        public IHttpActionResult Post(DailyEarningViewModel dailyEarningVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            dailyEarningVM.ModifiedBy = User.Identity.Name;

            var data = dailyEarningLogic.Create(dailyEarningVM);
            return Ok(data);
        }



        [HttpPut]
        public IHttpActionResult Put(DailyEarningViewModel dailyEarningVM)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            dailyEarningVM.ModifiedBy = User.Identity.Name;

            var data = dailyEarningLogic.Update(dailyEarningVM);
            return Ok(data);
        }

    }
}