using ScopoERP.Core.API;
using ScopoERP.Core.Merchant.ViewModels;
using ScopoERP.Core.Reports.ViewModels;
using ScopoERP.Core.Store.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using ScopoERP.Production.BLL;
using ScopoERP.Reports.BLL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace ScopoERP.API.Controllers.Common
{
    [Authorize]
    [RoutePrefix("api/Report")]
    public class ReportController : ApiController
    {
        public ReportLogic reportLogic;
        public ReportController(ReportLogic _reportLogic)
        {
            this.reportLogic = _reportLogic;
        }

        [Route("HourlyProduction")]
        [HttpGet]
        public IHttpActionResult GetHourlyProductionReport(DateTime fromdate, DateTime todate, string floor = null)
        {
            var data = reportLogic.GetHourlyProductionReport(fromdate, todate, floor);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("EmployeeProductionStatus")]
        [HttpGet]
        public IHttpActionResult GetEmployeeProductionStatus(DateTime fromdate, DateTime todate, string floor)
        {
            var data = reportLogic.GetEmployeeProductionStatus(fromdate, todate, floor);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetProductionReport")]
        [HttpGet]
        public IHttpActionResult GetProductionReport(DateTime productionDate, int? purchaseOrderId = null, string floor = null)
        {
            var data = reportLogic.GetProductionReport(productionDate, purchaseOrderId, floor);

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetMerchantRequisitionReport")]
        [HttpGet]
        public RequisitionReportViewModel RequisitionReport(int requisitionID)
        {
            RequisitionReportViewModel summaryData = reportLogic.GetRequisitionSummary(requisitionID);
            RequisitionSAM samData = reportLogic.GetRequistionSAM(summaryData.JobID);
            List<RequisitionPIViewModel> appliedForB2B = reportLogic.GetRequisitionAppliedForB2B(requisitionID);
            List<RequisitionPIViewModel> pendingForB2B = reportLogic.GetRequisitionPendingForB2B(requisitionID, summaryData.JobID);
            List<RequisitionPIViewModel> alreadyOpenedB2B = reportLogic.GetRequisitionAlreadyOpenedB2B(summaryData.JobID);

            List<RequisitionPO> requisitionPO = reportLogic.GetRequisitionPO(summaryData.JobID);
           

            summaryData.CPM = samData.CPM;
            summaryData.AvailableMinutes = samData.AvailableMinutes;
            summaryData.ActualCM = samData.ActualCM;
            summaryData.Ratio = samData.Ratio;

            summaryData.AppliedForB2BLCValue = appliedForB2B.Sum(x => x.PIValue);
            summaryData.PendingB2BLCValue = pendingForB2B.Sum(x => x.PIValue);
            summaryData.BackToBackLCValue = alreadyOpenedB2B.Sum(x => x.PIValue);
            summaryData.TotalValue = summaryData.AppliedForB2BLCValue + summaryData.PendingB2BLCValue
                                        + summaryData.BackToBackLCValue;
            summaryData.AvailableBudget = summaryData.BudgetValue - summaryData.TotalValue;
            summaryData.AppliedForB2BList = appliedForB2B;
            summaryData.AlreadyOpenedB2BList = alreadyOpenedB2B;
            summaryData.PendingForB2BList = pendingForB2B;
            summaryData.RequisitionPOList = requisitionPO;

            return summaryData;
        }

        [Route("GetArchiveReport")]
        [HttpGet]
        public IHttpActionResult GetArchiveReport(DateTime fromDate, DateTime toDate)
        {

            var data = reportLogic.GetArchiveDataReport(fromDate, toDate);

            return Ok(data);
        }

        [Route("GetSalarySheet")]
        [HttpGet]
        public IHttpActionResult GetSalarySheet(int month, int year,  string floor = null, int employeeType = 1)
        {

            var data = reportLogic.GetSalaryByMonthYear(month, year, floor, employeeType);

            return Ok(data);
        }

        [Route("GetContractPaper")]
        [HttpGet]
        public IHttpActionResult GetContractPaper(int jobID)
        {

            var data = reportLogic.GetContractPaper(jobID);

            return Ok(data);
        }

        [Route("GetNewRecruitmentReport")]
        [HttpGet]
        public IHttpActionResult GetNewRecruitmentReport(DateTime FromDate, DateTime ToDate, int ShiftId, string Floor, string CardNo = null)
        {

            var data = reportLogic.GetNewRecruitmentReport(FromDate, ToDate, ShiftId, Floor, 1, CardNo);

            return Ok(data);
        }

        [Route("GetPromotionReport")]
        [HttpGet]
        public IHttpActionResult GetPromotionReport(DateTime FromDate, DateTime ToDate, string Floor = null)
        {

            var data = reportLogic.GetPromotionReport(FromDate, ToDate, Floor);

            return Ok(data);
        }

        [Route("GetIncrementReport")]
        [HttpGet]
        public IHttpActionResult GetIncrementReport(DateTime FromDate, DateTime ToDate,  int EmployeeType, int? ShiftId = null, string Floor = null, string CardNo= null)
        {

            var data = reportLogic.GetIncrementReport(FromDate, ToDate, ShiftId, Floor, 1, CardNo, EmployeeType);

            return Ok(data);
        }

        [Route("GetDropOutReport")]
        [HttpGet]
        public IHttpActionResult GetDropOutReport(DateTime FromDate, int? ShiftId = null, string Floor = null, int? Days = null )
        {

            var data = reportLogic.GetDropOutReport(FromDate, ShiftId, Floor, Days);

            return Ok(data);
        }

        [Route("GetRegisterOfWorkerReport")]
        [HttpGet]
        public IHttpActionResult GetRegisterOfWorkerReport(string CardNo)
        {

            var data = reportLogic.GetRegisterOfWorkerReport(CardNo);

            return Ok(data);
        }

        [Route("GetDropedOutEmployeesReport")]
        [HttpGet]
        public IHttpActionResult GetDropedOutEmployeesReport(DateTime FromDate, DateTime ToDate, int ShiftId, string Floor = null, int InActiveType = 0, int GenderID = 0)
        {

            var data = reportLogic.GetDropedOutEmployeesReport(FromDate, ToDate, ShiftId, Floor, InActiveType, GenderID);

            return Ok(data);
        }

        [Route("AuditReportNoOfWorkers")]
        [HttpGet]
        public IHttpActionResult GetAuditReportTotalHoursAndNoOfWorkers(DateTime FromDate, DateTime ToDate, int ShiftId, string Floor)
        {

            var data = reportLogic.GetAuditReportTotalHoursAndNoOfWorkers(FromDate, ToDate, ShiftId, Floor);

            return Ok(data);
        }

        [Route("SecurityGuardRoster")]
        [HttpGet]
        public IHttpActionResult GetSecurityGuardRosterReport(DateTime FromDate, DateTime ToDate)
        {

            var data = reportLogic.GetSecurityGuardRosterReport(FromDate, ToDate);

            return Ok(data);
        }

        [Route("EarnLeaveSummary")]
        [HttpGet]
        public IHttpActionResult GetEarnLeaveSummaryReport(DateTime FromDate, DateTime ToDate, string Floor = null)
        {

            var data = reportLogic.GetEarnLeaveSummaryReport(FromDate, ToDate, Floor);

            return Ok(data);
        }

        [Route("EmployeeLeavePosting")]
        [HttpGet]
        public IHttpActionResult GetEmployeeLeavePostingReport(DateTime FromDate, DateTime ToDate, string Floor = null)
        {

            var data = reportLogic.GetEmployeeLeavePostingReport(FromDate, ToDate, Floor);

            return Ok(data);
        }

        [Route("EmployeeLeavePostingSummary")]
        [HttpGet]
        public IHttpActionResult GetEmployeeLeavePostingSummaryReport(DateTime FromDate, DateTime ToDate, string Floor = null)
        {

            var data = reportLogic.GetEmployeeLeavePostingSummaryReport(FromDate, ToDate, Floor);

            return Ok(data);
        }

        [Route("EarnLeaveCalculation")]
        [HttpGet]
        public IHttpActionResult GetEarnedLeaveCalculationReport(int Month, int Year, string Floor = null, int? EmployeeType = null)
        {

            var data = reportLogic.GetEarnedLeaveCalculationReport(Floor, EmployeeType, Month, Year);

            return Ok(data);
        }

        [Route("EidBonus")]
        [HttpGet]
        public IHttpActionResult GetEidBonusReport(string Floor, int EmployeeType)
        {

            var data = reportLogic.GetEidBonusReport(Floor, EmployeeType);

            return Ok(data);
        }

        [Route("SalarySummary")]
        [HttpGet]
        public IHttpActionResult GetSalarySummaryReport(int Month, int Year)
        {

            var data = reportLogic.GetSalarySummaryReport(Month, Year);

            return Ok(data);
        }

        [Route("BankSalary")]
        [HttpPost]
        public IHttpActionResult GetBankSalaryPadReport(ReportFilteringViewModel dReport)
        {

            var data = reportLogic.GetBankSalaryPadReport(dReport);

            return Ok(data);
        }

        [Route("ComperativeSummary")]
        [HttpPost]
        public IHttpActionResult GetComperativeSummaryReport(ReportFilteringViewModel dReport)
        {
            int branchId = 1;
            var data = reportLogic.GetComperativeSummaryReport(dReport, branchId);

            return Ok(data);
        }

        [Route("EmployeeBio")]
        [HttpPost]
        public IHttpActionResult GetEmployeeBioDataReport(ReportFilteringViewModel dReport)
        {
            var data = reportLogic.GetEmployeeBioDataReport(dReport);

            return Ok(data);
        }

        [Route("LeaveCorrectionReport")]
        [HttpPost]
        public IHttpActionResult LeaveCorrectionReport(ReportFilteringViewModel dReport)
        {
            var data = reportLogic.LeaveCorrectionReport(dReport);

            return Ok(data);
        }

        [Route("BillReport")]
        [HttpGet]
        public IHttpActionResult GetBillReport(DateTime FromDate, DateTime ToDate, string Floor, int BillType, string CardNo = null, int DepartmentID = 1, int? ShiftId = null)
        {
            List<TiffinBillViewModel> data = new List<TiffinBillViewModel>();

            if(BillType == 1)
            {
                data = reportLogic.GetTiffinBillReport(FromDate, ToDate, ShiftId, Floor, DepartmentID, CardNo);
            }
            else if(BillType == 2)
            {
                data = reportLogic.GetNightBillReport(FromDate, ToDate, ShiftId, Floor, DepartmentID, CardNo);
            }
            else if(BillType == 2)
            {
                data = reportLogic.GetHolidayBillReport(FromDate, ToDate, ShiftId, Floor, DepartmentID, CardNo);
            }
            return Ok(data);
        }

        [Route("EmployeesPaySlip")]
        [HttpPost]
        public IHttpActionResult GetSalaryPaySheetReport(ReportFilteringViewModel dReport)
        {
            int branchId = 1;
            var data = reportLogic.GetSalaryPaySheetReport(dReport, branchId);

            return Ok(data);
        }

        [Route("EmployeeIdCard")]
        [HttpPost]
        public IHttpActionResult GetEmployeeIdCardReport(ReportFilteringViewModel dReport)
        {
            int branchId = 1;
            var data = reportLogic.GetEmployeeIdCardReport(dReport, branchId);

            return Ok(data);
        }

        [Route("DropedNewJoinEmployees")]
        [HttpPost]
        public IHttpActionResult GetDropedNewJoinEmployeesInfoReport(ReportFilteringViewModel dReport)
        {
            var data = reportLogic.GetDropedNewJoinEmployeesInfoReport(dReport);

            return Ok(data);
        }

        [Route("DetailsWorking")]
        [HttpPost]
        public IHttpActionResult GetDetailsWorkingReport(ReportFilteringViewModel reportFilterVM)
        {
            int branchId = 1;
            List< WeeklyReportViewModel > data = new List< WeeklyReportViewModel >();
            switch (reportFilterVM.Decision)
            {
                case 1:
                    data = reportLogic.GetAuditReportDetail(reportFilterVM, branchId);
                    return Ok(data);
                case 2:
                    data = reportLogic.AuditReportTotalHoursAndNoOfWorkers(reportFilterVM, branchId);
                    return Ok(data);
                case 3:
                    data = reportLogic.AuditReportTotalHoursAndNoOfWorkers(reportFilterVM, branchId);
                    return Ok(data);
                case 4:
                    data = reportLogic.GetProgresiveReport(reportFilterVM, branchId);
                    return Ok(data);
                case 5:
                    data = reportLogic.GetAuditReportSummaryPerDay(reportFilterVM, branchId);
                    return Ok(data);
                default:
                    return BadRequest("Invalid decision value.");
            }
        }
    }
}