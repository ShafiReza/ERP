using QRCoder;
using ScopoERP.Commercial.ViewModel;
using ScopoERP.Common.ViewModel;
using ScopoERP.Core.Common.ViewModels;
using ScopoERP.Core.Finance.ViewModels;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Production.ViewModels;
using ScopoERP.Core.Reports.ViewModels;
using ScopoERP.Core.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Production.ViewModel;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using static System.Data.Entity.Infrastructure.Design.Executor;


namespace ScopoERP.Reports.BLL
{
    public class ReportLogic
    {
        private UnitOfWork unitOfWork;
        private HRContext hrContext;

        public ReportLogic(UnitOfWork unitOfWork, HRContext _hrContext)
        {
            this.unitOfWork = unitOfWork;
            this.hrContext = _hrContext;
        }

        public List<TrialBalanceReportViewModel> GetTrailBalanceData(DateTime fromDate, DateTime toDate, int branchId)
        {
            var query = $"EXEC GetTrailBalanceData '" + fromDate + "','" + toDate + "', " + branchId;
            var result = unitOfWork.TransactionRepository.SelectQuery<TrialBalanceReportViewModel>(query).ToList();

            return result;
        }

        public List<TrialBalanceReportViewModel> GetLedgerReportData(DateTime? fromDate, DateTime toDate, int branchId, int accountId)
        {
            if (fromDate == null)
                fromDate = unitOfWork.FinancialYearRepository.Get().Single().YearStartDate;

            var query = $"EXEC GetLedgerReportData '" + fromDate + "','" + toDate + "', " + branchId + ",'" + accountId + "'";
            var result = unitOfWork.TransactionRepository.SelectQuery<TrialBalanceReportViewModel>(query).ToList();

            return result;
        }

        public List<BalanceSheetReportViewModel> GetBalanceSheetData(DateTime toDate, int branchId)
        {
       
            var query = $"EXEC GetBalanceSheetData '" + toDate + "', " + branchId;
            var result = unitOfWork.TransactionRepository.SelectQuery<BalanceSheetReportViewModel>(query).ToList();

            return result;
        }

        public List<ArchiveDataReportViewModel> GetArchiveDataReport(DateTime fromDate, DateTime toDate)
        {
            var query = $"EXEC ScopoHR..GetArchiveData '" + fromDate + "','" + toDate + "' " ;
            var result = unitOfWork.TransactionRepository.SelectQuery<ArchiveDataReportViewModel>(query).ToList();

            return result;
        }

        public List<SalarySheetViewModel> GetSalaryByMonthYear(int month, int year, string floor, int employeeType)
        {
            string query = $"EXEC DMCHR..GetSalarySheet @year={year}, @month={month}, @floor='{floor}', @employeeType={employeeType}, @branchID={1}";
            List<SalarySheetViewModel> salarySheetList = unitOfWork.TransactionRepository.SelectQuery<SalarySheetViewModel>(query);
            return salarySheetList;
        }

        public List<BalanceSheetReportViewModel> GetIncomeStatementData(DateTime? fromDate, DateTime toDate, int costCeneterId)
        {
            if (fromDate == null)
                fromDate = unitOfWork.FinancialYearRepository.Get().Single().YearStartDate;
            var query = $"EXEC GetIncomeStatementData '" + fromDate + "','" + toDate + "'," + costCeneterId;
            var result = unitOfWork.TransactionRepository.SelectQuery<BalanceSheetReportViewModel>(query).ToList();

            return result;
        }

        public List<HourlyProductionStatusViewModel> GetHourlyProductionReport(DateTime fromdate, DateTime todate, string floor)
        {
            var data = (from s in unitOfWork.HourlyProductionStatusRepository.Get()
                        where s.Date >= fromdate.Date && s.Date <= todate.Date
                        && (floor != null ? s.Floor == floor : s.Floor == s.Floor)
                        group s by s.CardNo into gs
                        select new HourlyProductionStatusViewModel
                        {
                            CardNo = gs.Key,
                            Output = gs.Sum(x => x.Output),
                        }).ToList();

            return data;
        }

        public IEnumerable<ProductionReportViewModel> GetProductionReport(DateTime productionDate, int? purchaseOrderId = null, string floor = null)
        {
            var query = $"EXEC GetProductionReport '" + productionDate + "','" + floor + "'";
            var result = unitOfWork.HourlyProductionStatusRepository.SelectQuery<ProductionReportViewModel>(query).ToList();

            return result;
        }

        public IEnumerable<EmployeeProductionStatusViewModel> GetEmployeeProductionStatus(DateTime fromDate, DateTime toDate, string floor)
        {
            var data = unitOfWork.HourlyProductionStatusRepository
                .Get()
                .Where(x => x.Date >= fromDate && x.Date <= toDate && x.Floor == floor)
                .AsQueryable();

            var query = (from s in data
                         group s by new { s.CardNo, s.Date } into gs
                         select new
                         {
                             CardNo = gs.Key.CardNo,
                             Production = gs.Sum(x => x.Output),
                             Date = gs.Key.Date
                         });

            var result = (from s in query
                          group s by s.CardNo into gs
                          select new EmployeeProductionStatusViewModel
                          {
                              CardNo = gs.Key,
                              TotalProduction = gs.Sum(x => x.Production),
                              Performances = gs.Select(x => new OutputByDateViewModel
                              {
                                  Date = x.Date,
                                  Output = x.Production,
                              }).ToList()
                          }).OrderBy(x => x.CardNo).ToList();

            // Generate a set of dates within the date range
            var dateSet = Enumerable.Range(0, (int)(toDate - fromDate).TotalDays + 1)
                .Select(offset => fromDate.AddDays(offset))
                .ToList();

            // Fill missing dates for each employee
            foreach (var item in result)
            {
                var existingDates = new HashSet<DateTime>(item.Performances.Select(p => p.Date));
                var missingDates = dateSet.Except(existingDates);
                item.Performances.AddRange(missingDates.Select(date => new OutputByDateViewModel
                {
                    Date = date,
                    Output = 0
                }));

                // Sort the Performances list
                item.Performances.Sort((a, b) => a.Date.CompareTo(b.Date));
            }

            return result;
        }

        public RequisitionReportViewModel GetRequisitionSummary(int requisitionID)
        {
            RequisitionReportViewModel requisitionVM = new RequisitionReportViewModel();

            var jobInfo = (from r in unitOfWork.RequisitionRepository.Get()
                           join j in unitOfWork.JobRepository.Get() on r.JobID equals j.JobInfoId
                           where r.RequisitionID == requisitionID
                           select new
                           {
                               JobID = j.JobInfoId,
                               JobNo = j.JobNo,
                               ContractNo = j.ContractNo,
                               RequisitionNo = r.RequisitionNo,
                               RequisitionDate = r.RequisitionDate,
                               RequisitionSLNo = r.RequisitionSerial
                           }).SingleOrDefault();

            requisitionVM.JobID = jobInfo.JobID;
            requisitionVM.RequisitionNo = jobInfo.RequisitionNo;
            requisitionVM.RequisitionDate = jobInfo.RequisitionDate;
            requisitionVM.RequisitionSLNo = jobInfo.RequisitionSLNo;

            requisitionVM.JobNo = jobInfo.JobNo;
            requisitionVM.ContractNo = jobInfo.ContractNo;

            var poInfo = (from p in unitOfWork.PurchaseOrderRepository.Get()
                          where p.JobId == requisitionVM.JobID
                          group p by p.JobId into s
                          select new
                          {
                              OrderQuantity = s.Sum(x => x.OrderQuantity),
                              ContractValue = s.Sum(x => x.OrderQuantity * x.Fob),
                              AgreedCM = s.Sum(x => x.OrderQuantity * x.AgreedCm),
                              BudgetValue = s.Sum(x => x.OrderQuantity * x.Fob) - s.Sum(x => x.OrderQuantity * x.AgreedCm),
                              FirstShipmentDate = s.Min(x => x.ExitDate),
                              LastShipmentDate = s.Max(x => x.ExitDate)
                          }).SingleOrDefault();

            requisitionVM.ContractValue = poInfo.ContractValue;
            requisitionVM.BudgetValue = poInfo.BudgetValue;
            requisitionVM.AgreedCM = poInfo.AgreedCM;
            requisitionVM.OrderQuantity = poInfo.OrderQuantity;
            requisitionVM.FirstShipmentDate = poInfo.FirstShipmentDate;
            requisitionVM.LastShipmentDate = poInfo.LastShipmentDate;

            return requisitionVM;
        }

        public RequisitionSAM GetRequistionSAM(int jobID)
        {
            var query = "SELECT 0.05 AS CPM, "
                        + " SUM(P.OrderQuantity * S.Sam) AS AvailableMinutes, "
                        + " SUM(P.OrderQuantity * S.Sam) * 0.05 AS ActualCM, "
                        + " ((SUM(P.OrderQuantity * S.Sam) * 0.05) / SUM(P.OrderQuantity * P.Fob)) * 100 AS Ratio "
                        + " FROM postyle P "
                        + " INNER JOIN styleinfo S ON P.StyleId = S.StyleId "
                        + " WHERE P.JobId = " + jobID + " ";

            var data = unitOfWork.RequisitionRepository.SelectQuery<RequisitionSAM>(query).SingleOrDefault();

            return data;
        }

        public List<RequisitionPIViewModel> GetRequisitionAppliedForB2B(int requisitionID)
        {
            var result = (from w in unitOfWork.BookingRepository.Get()
                          join p in unitOfWork.PIRepository.Get() on w.PIId equals p.PIID
                          join sp in unitOfWork.SupplierRepository.Get() on p.SupplierID equals sp.SupplierId
                          join r in unitOfWork.RequisitionRepository.Get() on p.RequisitionID equals r.RequisitionID
                          where r.RequisitionID == requisitionID
                          group w by new { p.PIID, p.PINo, sp.SupplierName } into s
                          select new RequisitionPIViewModel
                          {
                              PINo = s.Key.PINo,
                              PIValue = s.Sum(x => x.TotalQuantity * x.UnitPrice) - (s.Key.PIID == 84263 ? 300 : 0),
                              SupplierName = s.Key.SupplierName,
                              BookingType = "Regular"
                          }).ToList();

            var fromExcessBooking = (from e in unitOfWork.ExcessBookingRepository.Get()
                                     join p in unitOfWork.PIRepository.Get() on e.ProformaInvoiceID equals p.PIID
                                     join s in unitOfWork.SupplierRepository.Get() on p.SupplierID equals s.SupplierId
                                     where p.RequisitionID == requisitionID
                                     select new RequisitionPIViewModel
                                     {
                                         PINo = p.PINo,
                                         PIValue = e.TotalPrice,
                                         SupplierName = s.SupplierName,
                                         BookingType = "Excess"
                                     }).ToList();

            result.AddRange(fromExcessBooking);

            return result;
        }

        public List<RequisitionPIViewModel> GetRequisitionPendingForB2B(int requisitionID, int jobID)
        {
            var result = (from w in unitOfWork.BookingRepository.Get()
                          join po in unitOfWork.PurchaseOrderRepository.Get() on w.PurchaseOrderID equals po.PoStyleId
                          join p in unitOfWork.PIRepository.Get() on w.PIId equals p.PIID
                          join sp in unitOfWork.SupplierRepository.Get() on p.SupplierID equals sp.SupplierId
                          join r in unitOfWork.RequisitionRepository.Get() on p.RequisitionID equals r.RequisitionID
                          where p.BackToBackLCID == null && r.RequisitionID != requisitionID
                          && ((po.JobId == jobID && p.LoanFromJobID == null) || p.LoanFromJobID == jobID)
                          group w by new { p.PINo, sp.SupplierName, r.RequisitionDate } into s
                          select new RequisitionPIViewModel
                          {
                              PINo = s.Key.PINo,
                              PIValue = s.Sum(x => x.TotalQuantity * x.UnitPrice),
                              RequisitionDate = s.Key.RequisitionDate,
                              SupplierName = s.Key.SupplierName,
                              BookingType = "Regular"
                          }).ToList();

            var fromExcessBooking = (from e in unitOfWork.ExcessBookingRepository.Get()
                                     join p in unitOfWork.PIRepository.Get() on e.ProformaInvoiceID equals p.PIID
                                     join s in unitOfWork.SupplierRepository.Get() on p.SupplierID equals s.SupplierId
                                     where p.BackToBackLCID == null && p.RequisitionID != requisitionID
                                     && ((e.JobID == jobID && p.LoanFromJobID == null) || p.LoanFromJobID == jobID)
                                     select new RequisitionPIViewModel
                                     {
                                         PINo = p.PINo,
                                         PIValue = e.TotalPrice,
                                         SupplierName = s.SupplierName,
                                         BookingType = "Excess"
                                     }).ToList();

            result.AddRange(fromExcessBooking);

            return result;
        }

        public List<RequisitionPIViewModel> GetRequisitionAlreadyOpenedB2B(int jobID)
        {
            var result = (from w in unitOfWork.BookingRepository.Get()
                          join po in unitOfWork.PurchaseOrderRepository.Get() on w.PurchaseOrderID equals po.PoStyleId
                          join p in unitOfWork.PIRepository.Get() on w.PIId equals p.PIID
                          join sp in unitOfWork.SupplierRepository.Get() on p.SupplierID equals sp.SupplierId
                          join b in unitOfWork.BackToBackLCRepository.Get() on p.BackToBackLCID equals b.BackToBackLCID
                          join l in unitOfWork.LCTypeRepository.Get() on b.LCTypeID equals l.PaymentTypeID
                          where p.BackToBackLCID != null
                          && ((b.JobID == jobID && p.LoanFromJobID == null) || p.LoanFromJobID == jobID)
                          group w by new
                          {
                              p.PINo,
                              sp.SupplierName,
                              b.BackToBackLC1,
                              b.BackToBackLCValue,
                              b.BackToBackLCDate,
                              l.PaymentTitle,
                              p.LoanFromJobID
                          } into s
                          select new RequisitionPIViewModel
                          {
                              PINo = s.Key.PINo,
                              PIValue = s.Sum(x => x.TotalQuantity * x.UnitPrice),
                              SupplierName = s.Key.SupplierName,
                              LCType = s.Key.PaymentTitle,
                              BackToBackLC = s.Key.BackToBackLC1,
                              BackToBackLCDate = s.Key.BackToBackLCDate,
                              BackToBackLCValue = s.Key.BackToBackLCValue,
                              BookingType = s.Key.LoanFromJobID == null ? "Regular" : "Loan"
                          }).ToList();

            var fromExcessBooking = (from e in unitOfWork.ExcessBookingRepository.Get()
                                     join p in unitOfWork.PIRepository.Get() on e.ProformaInvoiceID equals p.PIID
                                     join s in unitOfWork.SupplierRepository.Get() on p.SupplierID equals s.SupplierId
                                     join b in unitOfWork.BackToBackLCRepository.Get() on p.BackToBackLCID equals b.BackToBackLCID
                                     join l in unitOfWork.LCTypeRepository.Get() on b.LCTypeID equals l.PaymentTypeID
                                     where p.BackToBackLCID != null && ((e.JobID == jobID && p.LoanFromJobID == null) || p.LoanFromJobID == jobID)
                                     select new RequisitionPIViewModel
                                     {
                                         PINo = p.PINo,
                                         PIValue = e.TotalPrice,
                                         SupplierName = s.SupplierName,
                                         LCType = l.PaymentTitle,
                                         BackToBackLC = b.BackToBackLC1,
                                         BackToBackLCDate = b.BackToBackLCDate,
                                         BackToBackLCValue = b.BackToBackLCValue,
                                         BookingType = "Excess"
                                     }).ToList();

            result.AddRange(fromExcessBooking);
            return result;
        }

        public List<RequisitionPO> GetRequisitionPO(int jobID)
        {
            var poInfo = (from ps in unitOfWork.PurchaseOrderRepository.Get()
                          where ps.JobId == jobID
                          group ps by ps.ExitDate into p
                          select new RequisitionPO
                          {
                              ExitDate = p.Key,
                              TotalFOB = p.Sum(x => x.Fob * x.OrderQuantity),
                              TotalBudget = p.Sum(x => x.Fob * x.OrderQuantity) - p.Sum(x => x.AgreedCm * x.OrderQuantity)
                          }).ToList();

            var b2bInfo = (from w in unitOfWork.BookingRepository.Get()
                           join ps in unitOfWork.PurchaseOrderRepository.Get() on w.PurchaseOrderID equals ps.PoStyleId
                           join pi in unitOfWork.PIRepository.Get() on w.PIId equals pi.PIID
                           //join b in unitOfWork.BackToBackLCRepository.Get() on pi.BackToBackLCID equals b.BackToBackLCID
                           where pi.BackToBackLCID != null && ((ps.JobId == jobID && pi.LoanFromJobID == null) || pi.LoanFromJobID == jobID)
                           group w by ps.ExitDate into s
                           select new RequisitionPO
                           {
                               ExitDate = s.Key,
                               TotalB2BLCValue = s.Sum(x => x.TotalQuantity * x.UnitPrice)
                           }).ToList();

            var result = (from s in poInfo
                          join c in b2bInfo on s.ExitDate equals c.ExitDate into g
                          from b in g.DefaultIfEmpty()
                          select new RequisitionPO
                          {
                              ExitDate = s.ExitDate,
                              TotalFOB = s.TotalFOB,
                              TotalBudget = s.TotalBudget,
                              TotalB2BLCValue = b == null ? 0 : b.TotalB2BLCValue
                          }).ToList();

            return result;
        }

        public List<ContractPaperViewModel> GetContractPaper(int jobID)
        {
            var result = (from p in unitOfWork.PurchaseOrderRepository.Get()
                          join s in unitOfWork.StyleRepository.Get() on p.StyleId equals s.StyleId
                          where p.JobId == jobID && p.OrderQuantity > 0
                          select new ContractPaperViewModel
                          {
                              PurchaseOrderID = p.PoStyleId,
                              StyleNo = s.StyleNo,
                              StyleDescription= s.StyleDescription,
                              PONo = p.PoNo,
                              OrderQuantity = p.OrderQuantity,
                              FOB = p.Fob,
                              TotalFOB = p.OrderQuantity * p.Fob,
                              ExitDate = p.ExitDate,
                              Item = s.StyleDescription,
                              FactoryCM = p.AgreedCm - (p.Fob * 0.05m - 0.1m),
                              Febrication = s.Febrication,
                              HSCode = s.HSCode
                          }).ToList();

                var sizeFOB = (from s in unitOfWork.SizeColorRepository.Get()
                               join p in unitOfWork.PurchaseOrderRepository.Get() on s.PoStyleId equals p.PoStyleId
                               where p.JobId == jobID && s.FOB != null
                               group s by new { s.PoStyleId, s.FOB } into g
                               select new
                               {
                                   PurchaseOrderID = g.Key.PoStyleId,
                                   Quantity = g.Sum(x => x.Quantity),
                                   FOB = g.Key.FOB ?? Decimal.Zero
                               }).ToList();

                var data = (from p in result
                            join z in sizeFOB on p.PurchaseOrderID equals z.PurchaseOrderID into g
                            from s in g.DefaultIfEmpty()
                            select new ContractPaperViewModel
                            {
                                PurchaseOrderID = p.PurchaseOrderID,
                                StyleNo = p.StyleNo,
                                StyleDescription = p.StyleDescription,
                                PONo = p.PONo,
                                OrderQuantity = s != null ? s.Quantity : p.OrderQuantity,
                                FOB = s != null ? s.FOB : p.FOB,
                                TotalFOB = s != null ? s.Quantity * s.FOB : p.TotalFOB,
                                ExitDate = p.ExitDate,
                                Item = p.Item,
                                FactoryCM = p.FactoryCM,
                                Febrication = p.Febrication,
                                HSCode = p.HSCode
                            }).ToList();

                return data;
         
        }

        public List<NewRecruitmentViewModel> GetNewRecruitmentReport(DateTime FromDate, DateTime ToDate, int ShiftId, string Floor, int DepartmentID, string CardNo)
        {
            var query = $"EXEC ScopoHR..GetNewRecruitmentList '" + FromDate + "','" + ToDate + "','" +Floor + "','" +  1  + "','" + ShiftId + "','" + CardNo + "','" + DepartmentID + "'";
            var result = unitOfWork.UserRepository.SelectQuery<NewRecruitmentViewModel>(query).ToList();
            return result;
        }

        public List<PromotionViewModel> GetPromotionReport(DateTime FromDate, DateTime ToDate, string Floor)
        {
            var query = $"EXEC ScopoHR..GetPromotionData '" + FromDate + "','" + ToDate + "','" + Floor + "'";
            var result = unitOfWork.UserRepository.SelectQuery<PromotionViewModel>(query).ToList();
            return result;
        }

        public List<IncrementReportViewModel> GetIncrementReport(DateTime FromDate, DateTime ToDate, int? ShiftId, string Floor, int DepartmentID, string CardNo, int EmployeeType)
        {
            var query = $"EXEC ScopoHR..GetIncrementData '" + FromDate + "','" + ToDate + "','" + Floor + "','" + 1 + "','" + ShiftId + "','" + CardNo + "','" + DepartmentID + "','" + EmployeeType + "'";
            var result = unitOfWork.UserRepository.SelectQuery<IncrementReportViewModel>(query).ToList();
            return result;
        }

        public List<DropOutReportViewModel> GetDropOutReport(DateTime FromDate, int? ShiftId, string Floor, int? Days)
        {
            var query = $"EXEC ScopoHR..GetDropOutList '" + FromDate.ToString() + "','" + Floor + "','" + ShiftId + "','" + Days + "'";

            var result = unitOfWork.UserRepository.SelectQuery<DropOutReportViewModel>(query).ToList();
            return result;
        }

        public List<RegisterOfWorkerViewModel> GetRegisterOfWorkerReport(string CardNo)
        {
            var query = $"EXEC ScopoHR..GetRegisterOfWorkerData '" + CardNo + "'";
            var result = unitOfWork.UserRepository.SelectQuery<RegisterOfWorkerViewModel>(query).ToList();
            return result;
        }

        public List<DropOutReportViewModel> GetDropedOutEmployeesReport(DateTime FromDate, DateTime ToDate, int ShiftId, string Floor, int InActiveType, int GenderID)
        {
 
            var query = $"EXEC ScopoHR..GetDropedOutEmployeeList '" + FromDate.ToString() + "','" + ToDate.ToString() + "','" + Floor + "','" + ShiftId + "'," + InActiveType + "," + GenderID;

            var result = unitOfWork.UserRepository.SelectQuery<DropOutReportViewModel>(query).ToList();
            return result;
        }

        public List<WeeklyReportViewModel> GetAuditReportTotalHoursAndNoOfWorkers(DateTime FromDate, DateTime ToDate, int ShiftId, string Floor)
        {
            var query = $"EXEC ScopoHR..AuditReportTotalHourAndNoOfWorker '{FromDate}', '{ToDate}', '{1}','{ShiftId}','{Floor}'";
            var result = unitOfWork.UserRepository.SelectQuery<WeeklyReportViewModel>(query).ToList();
            return result;
        }

        public List<SecurityGuardRosterViewModel> GetSecurityGuardRosterReport(DateTime FromDate, DateTime ToDate)
        {
            var query = $"EXEC ScopoHR..GetSecurityGuardRosterData '" + FromDate + "','" + ToDate + "'";
            var result = unitOfWork.UserRepository.SelectQuery<SecurityGuardRosterViewModel>(query).ToList();
            return result;
        }

        public List<EarnLeaveSummaryReportViewModel> GetEarnLeaveSummaryReport(DateTime FromDate, DateTime ToDate, string Floor)
        {
            var query = $"EXEC ScopoHR..GetEarnLeaveSummaryReport '" + FromDate + "','" + ToDate + "','" + Floor + "'";
            var result = unitOfWork.UserRepository.SelectQuery<EarnLeaveSummaryReportViewModel>(query).ToList();
            return result;
        }

        public List<EmployeeLeaveHistoryViewModel> GetEmployeeLeavePostingReport(DateTime FromDate, DateTime ToDate, string Floor)
        {
            var query = $"EXEC ScopoHR..GetLeavePostingDetails '" + FromDate + "','" + ToDate + "','" + Floor + "'";
            var result = unitOfWork.UserRepository.SelectQuery<EmployeeLeaveHistoryViewModel>(query).ToList();
            return result;
        }

        public List<EarnedLeaveCalculationReportViewModel> GetEarnedLeaveCalculationReport(string Floor, int? EmployeeType, int Month, int Year)
        {
            var query = $"EXEC ScopoHR..GetEarnedLeaveCalculationReport '" + Floor + "','" + EmployeeType + "','" + Month + "','" + Year + "'";

            var result = unitOfWork.UserRepository.SelectQuery<EarnedLeaveCalculationReportViewModel>(query).ToList();
            return result;
        }

        public List<EidBonusVIewModel> GetEidBonusReport(string Floor, int EmployeeType)
        {
            var query = $"EXEC ScopoHR..GetEidBonusData '" + Floor + "','" + EmployeeType + "'";
            var result = unitOfWork.UserRepository.SelectQuery<EidBonusVIewModel>(query).ToList();
            return result;
        }

        public List<SalarySummaryViewModel> GetSalarySummaryReport(int Month, int Year)
        {
            var query = $"EXEC ScopoHR..GetSalarySummaryData '" + Month + "','" + Year + "'";
            var result = unitOfWork.UserRepository.SelectQuery<SalarySummaryViewModel>(query).ToList();
            return result;
        }

        public List<BankSalaryPadReportViewModel> GetBankSalaryPadReport(ReportFilteringViewModel dReport)
        {
            var query = $"EXEC ScopoHR..GetBankSalaryPad '" + dReport.Month + "','" + dReport.BankName + "','" + dReport.Company + "','" + dReport.Year + "'";
            var result = unitOfWork.UserRepository.SelectQuery<BankSalaryPadReportViewModel>(query).ToList();
            return result;
        }

        public List<TiffinBillViewModel> GetTiffinBillReport(DateTime FromDate, DateTime ToDate, int? ShiftId, string Floor, int DepartmentID, string CardNo)
        {
            var query = $"EXEC ScopoHR..GetTiffinBillData '" + FromDate + "','" + ToDate + "','" + Floor + "','" + 1 + "','" + ShiftId + "','" + CardNo + "','" + DepartmentID + "'";
            var result = unitOfWork.UserRepository.SelectQuery<TiffinBillViewModel>(query).ToList();
            return result;
        }

        public List<TiffinBillViewModel> GetNightBillReport(DateTime FromDate, DateTime ToDate, int? ShiftId, string Floor, int DepartmentID, string CardNo)
        {
            var query = $"EXEC ScopoHR..GetNightBillData '" + FromDate + "','" + ToDate + "','" + Floor + "','" + 1 + "','" + ShiftId + "','" + CardNo + "','" + DepartmentID + "'";
            var result = unitOfWork.UserRepository.SelectQuery<TiffinBillViewModel>(query).ToList();
            return result;
        }

        public List<TiffinBillViewModel> GetHolidayBillReport(DateTime FromDate, DateTime ToDate, int? ShiftId, string Floor, int DepartmentID, string CardNo)
        {
            var query = $"EXEC ScopoHR..GetHolidayBillData '" + FromDate + "','" + ToDate + "','" + Floor + "','" + 1 + "','" + ShiftId + "','" + CardNo + "','" + DepartmentID + "'";
            var result = unitOfWork.UserRepository.SelectQuery<TiffinBillViewModel>(query).ToList();
            return result;
        }

        public List<EmployeeLeaveHistoryViewModel> GetEmployeeLeavePostingSummaryReport(DateTime FromDate, DateTime ToDate, string Floor)
        {
            var query = $"EXEC ScopoHR..GetLeavePostingSummaryData '" + FromDate + "','" + ToDate + "','" + Floor + "'";
            var result = unitOfWork.UserRepository.SelectQuery<EmployeeLeaveHistoryViewModel>(query).ToList();
            return result;
        }

        public List<ComperativeSummaryReportViewModel> GetComperativeSummaryReport(ReportFilteringViewModel dReport, int id)
        {
            var query = $"EXEC ScopoHR..GetComparetiveStatement '" + dReport.FirstMonth + "','" + dReport.SecondMonth + "','" + dReport.Floor + "','" + id + "','" + dReport.ShiftId + "','" + dReport.FirstYear + "','" + dReport.SecondYear + "'";
            var result = unitOfWork.UserRepository.SelectQuery<ComperativeSummaryReportViewModel>(query).ToList();
            return result;
        }

        public List<EmployeeBioDataViewModel> GetEmployeeBioDataReport(ReportFilteringViewModel reportFilteringVM)
        {
            var query = $"EXEC ScopoHR..GetEmployeeBioData '" + reportFilteringVM.CardNo + "'";
            var result = unitOfWork.UserRepository.SelectQuery<EmployeeBioDataViewModel>(query).ToList();
            return result;
        }

        public List<OneTimeEntryReportViewModel> LeaveCorrectionReport(ReportFilteringViewModel dReport)
        {
            var query = $"EXEC ScopoHR..GetLeaveCorrectionData '" + dReport.FromDate + "','" + dReport.ToDate + "','" + dReport.InTime + "','" + dReport.OutTime + "','" + dReport.LeaveTypeReport + "'";
            var result = unitOfWork.UserRepository.SelectQuery<OneTimeEntryReportViewModel>(query).ToList();
            return result;
        }

        public List<SalarySheetViewModel> GetSalaryPaySheetReport(ReportFilteringViewModel dReport, int id)
        {
            var query = $"EXEC ScopoHR..GetSalarySheet '" + dReport.Month + "','" + dReport.Floor + "','" + id + "','" + dReport.ShiftId + "','" + dReport.CardNo + "','" + dReport.DepartmentID + "','" + dReport.EmployeeType + "','" + dReport.IsActive + "','" + dReport.BankSalary + "','" + dReport.Year + "'";
            var result = unitOfWork.UserRepository.SelectQuery<SalarySheetViewModel>(query).ToList();
            return result;
        }

        public List<EmployeeIdCardViewModel> GetEmployeeIdCardReport(ReportFilteringViewModel dReport, int id)
        {
            var query = $"EXEC ScopoHR..GetEmployeeIdCardInfo '" + dReport.CardNo + "'";
            var result = unitOfWork.UserRepository.SelectQuery<EmployeeIdCardViewModel>(query).ToList();
            var empid = result[0].EmployeeID;
            var docProfile = hrContext.Documents.Where(w => w.EmployeeId == empid && w.Category == 1).Select(s => s.UniqueIdentifier).FirstOrDefault();
            var docFingerPrint = hrContext.Documents.Where(w => w.EmployeeId == empid && w.Category == 3).Select(s => s.UniqueIdentifier).FirstOrDefault();

            //string baseURL = @"file://" + HostingEnvironment.MapPath(ConfigurationManager.AppSettings.Get(DocumentCategory.ProfilePhoto.ToString()));
            //result[0].UniqueIdentifier = baseURL + result[0].UniqueIdentifier;

            result[0].UniqueIdentifier = docProfile;
            result[0].FingerPrint = docFingerPrint;
            result[0].QRCode = GetQrCode(result);
            return result;
        }
        private byte[] GetQrCode(List<EmployeeIdCardViewModel> result)
        {

            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(result[0].CardNo + System.Environment.NewLine + System.Environment.NewLine + "NID :" + result[0].NID + System.Environment.NewLine + System.Environment.NewLine + result[0].MobileNo, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);

            byte[] bytes = new byte[0];
            using (System.IO.MemoryStream stream = new System.IO.MemoryStream())
            {
                qrCodeImage.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                bytes = stream.ToArray();
            }

            return bytes;
        }

        public List<WeeklyReportViewModel> GetAuditReportDetail(ReportFilteringViewModel reportFilterVM, int branchId)
        {
            var query = $"EXEC ScopoHR..AuditReportDetail '{reportFilterVM.FromDate}', '{reportFilterVM.ToDate}', '{branchId}','{reportFilterVM.ShiftId}','{reportFilterVM.Floor}','{reportFilterVM.OtHour}'";
            var result = unitOfWork.UserRepository.SelectQuery<WeeklyReportViewModel>(query).ToList();
            return result;
        }

        public List<WeeklyReportViewModel> GetProgresiveReport(ReportFilteringViewModel reportFilterVM, int branchId)
        {
            var query = $"EXEC ScopoHR..GetProgresiveReport '{reportFilterVM.FromDate}', '{reportFilterVM.ToDate}', '{branchId}','{reportFilterVM.ShiftId}','{reportFilterVM.Floor}'";
            var result = unitOfWork.UserRepository.SelectQuery<WeeklyReportViewModel>(query).ToList();
            return result;
        }

        public List<WeeklyReportViewModel> GetAuditReportSummaryPerDay(ReportFilteringViewModel reportFilterVM, int id)
        {
            var query = $"EXEC ScopoHR..AuditReportSummaryOfWorker '{reportFilterVM.FromDate}', '{reportFilterVM.ToDate}', '{id}','{reportFilterVM.ShiftId}','{reportFilterVM.Floor}'";
            var result = unitOfWork.UserRepository.SelectQuery<WeeklyReportViewModel>(query).ToList();

            return result;
        }
        public List<WeeklyReportViewModel> AuditReportTotalHoursAndNoOfWorkers(ReportFilteringViewModel reportFilterVM, int branchId)
        {
            var query = $"EXEC ScopoHR..AuditReportTotalHourAndNoOfWorker '{reportFilterVM.FromDate}', '{reportFilterVM.ToDate}', '{branchId}','{reportFilterVM.ShiftId}','{reportFilterVM.Floor}'";
            var result = unitOfWork.UserRepository.SelectQuery<WeeklyReportViewModel>(query).ToList();
            return result;
        }

        public List<DropedNewEmployeeInfoViewModel> GetDropedNewJoinEmployeesInfoReport(ReportFilteringViewModel dReport)
        {
            var query = $"EXEC ScopoHR..GetDropedNewJoinEmployeeInfoList '" + dReport.FromDate.ToString() + "','" + dReport.ToDate.ToString() + "','" + dReport.Floor + "'";

            var result = unitOfWork.UserRepository.SelectQuery<DropedNewEmployeeInfoViewModel>(query).ToList();
            return result;
        }


    }
}

