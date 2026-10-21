using ScopoERP.Core.HR.Services;
using ScopoERP.Core.HR.ViewModels;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static System.Data.Entity.Infrastructure.Design.Executor;

namespace ScopoERP.API.Controllers.HR
{
    [Authorize]
    [RoutePrefix("api/Attendance")]
    public class AttendanceController : ApiController
    {
        private AttendanceService attendanceService;

        public AttendanceController(AttendanceService _attendanceService)
        {
            this.attendanceService = _attendanceService;
        }

        [HttpGet]
        public IHttpActionResult Get(DateTime fromDate, DateTime toDate, 
            string cardNo = null, string floor = null, int? sectionId = null, int? shiftId = null)
        {
            var data = attendanceService.GetAttendanceReport(fromDate, toDate, cardNo, floor);

            return Ok(data);
        }

        [Route("GetDailyAttendanceSummary")]
        [HttpGet]
        public IHttpActionResult GetDailyAttendanceSummary(DateTime fromDate, string floor, int shiftId, int employeeType)
        {
            var data = attendanceService.GetDailyAttendanceSummary(fromDate, floor, shiftId, employeeType);

            return Ok(data);
        }

        [Route("TotalMinutes")]
        [HttpGet]
        public IHttpActionResult GetTotalMinutes(DateTime productionDate, string floor)
        {
            var data = attendanceService.GetTotalMinutes(productionDate, floor);

            return Ok(data);
        }

        [Route("GetAttendanceReportOfStaff")]
        [HttpGet]
        public IHttpActionResult GetAttendanceReportOfStaff(DateTime prevDate, DateTime toDate, string cardNo = null, string floor = null)
        {
            var data = attendanceService.GetAttendanceReportOfStaff(prevDate, toDate, cardNo, floor);

            return Ok(data);
        }

        [Route("GetOneTimePunchReport")]
        [HttpGet]
        public IHttpActionResult GetOneTimePunchReport(DateTime FromDate, DateTime ToDate, string ShiftId, string FloorName)
        {
            var data = attendanceService.GetOneTimePunchReport(FromDate, ToDate, ShiftId, FloorName);

            return Ok(data);
        }

        [Route("OneTimePunchUpdate")]
        [HttpPost]
        public IHttpActionResult UpdateOneTimePunch(List<OneTimeEntryReportViewModel> attendanceList)
        {
            attendanceService.Update(attendanceList, User.Identity.Name);

            return Ok(attendanceList);
        }

        [Route("AbsentReport")]
        [HttpGet]
        public IHttpActionResult GetAbsentReport(DateTime FromDate, int ShiftId, string Floor, int EmployeeType)
        {
            var data = attendanceService.GetAbsentReport(FromDate, ShiftId, Floor, EmployeeType);

            return Ok(data);
        }

        [Route("DailyAttendance")]
        [HttpPost]
        public IHttpActionResult GetDailyReportByDateFloor(DailyReportFilteringViewModel dReport)
        {
            var data = attendanceService.GetDailyReportByDateFloor(dReport, 1);

            return Ok(data);
        }

        [Route("EmployeeAttendance")]
        [HttpPost]
        public IHttpActionResult GetDailyAttendance(SearchAttendanceViewModel searchVM)
        {
            var data = attendanceService.GetDailyAttendance(searchVM,1);

            return Ok(data);
        }

        [Route("SaveAttendance")]
        [HttpPost]
        public IHttpActionResult Save(AttendanceViewModel at)
        {
            attendanceService.Save(at, User.Identity.Name);

            return Ok(at);
        }

        [Route("DeleteAttendance")]
        [HttpPost]
        public IHttpActionResult DeleteAttendance(AttendanceViewModel at)
        {
            attendanceService.DeleteAttendance(at, User.Identity.Name);

            return Ok(at);
        }

        [HttpPost]
        public IHttpActionResult Post(List<AttendanceViewModel> attList)
        {
            attendanceService.SaveAttendanceFromCSV(attList);
            return Ok();
        }

        [HttpPut]
        public IHttpActionResult Put()
        {
            return Ok();
        }
    }
}
