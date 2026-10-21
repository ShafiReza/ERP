using AutoMapper;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Mapper;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class AttendanceService
    {
        private UnitOfWork unitOfWork;
        private HRContext _context;
        private IMapper mapper;

        public AttendanceService(UnitOfWork _unitOfWork, HRContext context)
        {
            this.unitOfWork = _unitOfWork;
            _context = context;
            mapper = MapperConfigure.Initialize();
        }

        public void SaveAttendanceFromCSV(List<AttendanceViewModel> attList)
        {
            var attendanceEntities = mapper.Map<List<Attendance>>(attList);
            _context.Attendances.AddRange(attendanceEntities);
            _context.SaveChanges();
        }

        public List<AttendanceSummaryViewModel> GetTotalMinutes(DateTime date, string floor)
        {
            string query;

            if (floor == "Unit-One" || floor == "Unit-Two")
                query = $"EXEC DMCHR..GetAttendanceMinutes '{date.ToString("yyyy-MM-dd")}', '{floor}'";
            else
                query = $"EXEC ScopoHR..GetAttendanceMinutes '{date.ToString("yyyy-MM-dd")}', '{floor}'";

            var data = unitOfWork.ProductionStatusRepository.SelectQuery<AttendanceSummaryViewModel>(query);

            return data;
        }

        public List<AttendanceViewModel> GetAttendanceReport(DateTime fromDate, DateTime toDate, string cardNo, string floor)
        {
            string query = $"EXEC ScopoHR..GetAttendanceReport '{fromDate.ToString("yyyy-MM-dd")}', '{toDate.ToString("yyyy-MM-dd")}','{floor}', '{1}','','{cardNo}'";

            var data = unitOfWork.UserRepository.SelectQuery<AttendanceViewModel>(query);

            if (data == null || data.Count == 0)
            {
                query = $"EXEC DMCHR..GetAttendanceReport '{fromDate.ToString("yyyy-MM-dd")}', '{toDate.ToString("yyyy-MM-dd")}','{floor}', '{1}','','{cardNo}'";
                
                data = unitOfWork.UserRepository.SelectQuery<AttendanceViewModel>(query);
            }
            return data;
        }

        public List<DailyAttendanceSummaryViewModel> GetDailyAttendanceSummary(DateTime fromDate, string floor, int shiftId, int employeeType)
        {
            string query;

            if (floor == "Unit-One" || floor == "Unit-Two")
                query = $"EXEC DMCHR..GetAttendanceSummary '{fromDate.ToString("yyyy-MM-dd")}', '{floor}','{1}','{shiftId}',{employeeType}";
            else
                query = $"EXEC ScopoHR..GetAttendanceSummary '{fromDate.ToString("yyyy-MM-dd")}', '{floor}','{1}','{shiftId}',{employeeType}";

            var data = unitOfWork.UserRepository.SelectQuery<DailyAttendanceSummaryViewModel>(query);

            return data;
        }

        public List<AttendanceReportViewModel> GetAbsentReport(DateTime FromDate, int ShiftId, string Floor, int EmployeeType)
        {
            string query;

            if (Floor == "Unit-One" || Floor == "Unit-Two")
                query = $"EXEC DMCHR..GetAbsentReport '{FromDate.ToString()}','{FromDate.ToString()}', '{Floor}','{1}','{ShiftId}','{EmployeeType}'";
            else
                query = $"EXEC ScopoHR..GetAbsentReport '{FromDate.ToString()}','{FromDate.ToString()}', '{Floor}','{1}','{ShiftId}','{EmployeeType}'";

            var data = unitOfWork.UserRepository.SelectQuery<AttendanceReportViewModel>(query).ToList();

            return data;
        }

        public List<AttendanceViewModel> GetAttendanceReportOfStaff(DateTime prevDate, DateTime toDate, string cardNo, string floor)
        {

            string query_1 = $"EXEC ScopoHR..GetAttendanceReport '{prevDate.ToString("yyyy-MM-dd")}', '{prevDate.ToString("yyyy-MM-dd")}','{floor}', '{1}','','{cardNo}'";

            var previousDayData = unitOfWork.UserRepository.SelectQuery<AttendanceViewModel>(query_1);

            string query_2 = $"EXEC ScopoHR..GetAttendanceReport '{toDate.ToString("yyyy-MM-dd")}', '{toDate.ToString("yyyy-MM-dd")}','{floor}', '{1}','','{cardNo}'";

            var todayData = unitOfWork.UserRepository.SelectQuery<AttendanceViewModel>(query_2);

            var result = (from t in todayData
                          join p in previousDayData on t.CardNo equals p.CardNo
                          select new AttendanceViewModel
                          {
                              CardNo = t.CardNo,
                              EmployeeName = t.EmployeeName,
                              InTime = t.InTime,
                              OutTime = p.OutTime,
                              DepartmentName = t.DepartmentName,
                              DesignationName = t.DesignationName,
                              Floor = t.Floor,
                              WorkingHours = p.WorkingHours,
                              Status = t.Status,
                              Date = t.Date,
                              DutyTime = "8.30 - 17.30",
                              JoinDate = t.JoinDate,
                          }).ToList();



            return result;
        }

        public List<OneTimeEntryReportViewModel> GetOneTimePunchReport(DateTime FromDate, DateTime ToDate, string ShiftId, string FloorName)
        {
            string query;

            if (FloorName == "Unit-One" || FloorName == "Unit-Two")
                query = $"EXEC DMCHR..GetOneTimePunchReport '" + FromDate + "','" + ShiftId + "','" + FloorName + "','" + ToDate + "'";
            else
                query = $"EXEC ScopoHR..GetOneTimePunchReport '" + FromDate + "','" + ShiftId + "','" + FloorName + "','" + ToDate + "'";

            //var query = $"EXEC GetOneTimeEntryReportByDate '{dReport.FromDate.ToString()}'";
            List<OneTimeEntryReportViewModel> result = unitOfWork.UserRepository.SelectQuery<OneTimeEntryReportViewModel>(query).ToList();
            foreach (var a in result)
            {
                if (a.OutTimeDate == null)
                {
                    a.OutTimeDate = FromDate.Date;
                }
            }

            return result;
        }

        public void Update(List<OneTimeEntryReportViewModel> attendanceList, string name)
        {
            foreach (var at in attendanceList)
            {
                var generatedCardNo = _context.CardNoMappings.Where(x => x.OriginalCardNo == at.CardNo).SingleOrDefault();

                if (at.OutTime != null)
                {
                  var  attendance = new Attendance
                    {
                        CardNo = generatedCardNo.GeneratedCardNo,
                        InOutTime = Convert.ToDateTime(at.OutTimeDate).Date + Convert.ToDateTime(at.OutTime).TimeOfDay,
                        ModifiedBy = name,
                        IsDeleted = false,
                        LastModified = DateTime.Now,
                        Remarks = "One Time Entry Update"
                    };
                    _context.Attendances.Add(attendance);
                }
                //for out time entry


            }
            _context.SaveChanges();
        }

        public List<DailyReportViewModel> GetDailyReportByDateFloor(DailyReportFilteringViewModel dReport, int branch)
        {
            string query;
            if (!String.IsNullOrEmpty(dReport.FloorID) && (dReport.FloorID == "Unit-One" || dReport.FloorID == "Unit-Two"))
                query = $"EXEC DMCHR..GetAttendanceData '" + dReport.FromDate.ToString() + "','" + dReport.ToDate.ToString() + "','" + dReport.FloorID + "','" + branch + "','" + dReport.ShiftId + "','" + "'";
            else
                query = $"EXEC ScopoHR..GetAttendanceData '" + dReport.FromDate.ToString() + "','" + dReport.ToDate.ToString() + "','" + dReport.FloorID + "','" + branch + "','" + dReport.ShiftId + "','" + "'";

            List<DailyReportViewModel> attendanceList = unitOfWork.UserRepository.SelectQuery<DailyReportViewModel>(query);
            var filterdList = (from st in attendanceList
                               join e in _context.Employees on st.EmployeeID equals e.EmployeeID
                               join d in _context.Designations on e.DesignationID equals d.DesignationID
                               where (dReport.EmployeeTypeID == null ? st.Status != null : e.EmployeeType == dReport.EmployeeTypeID) && (dReport.desgList == null ? st.Status != null : dReport.desgList.Contains(e.DesignationID))
                               select new DailyReportViewModel
                               {
                                   CardNo = st.CardNo,
                                   OriginalCardNo = st.OriginalCardNo,
                                   DesignationID = e.DesignationID,
                                   DesignationName = d.DesignationName,
                                   DepartmentID = e.DepartmentID,
                                   EmployeeTypeID = e.EmployeeType,
                                   DepartmentName = st.DepartmentName,
                                   EmployeeID = st.EmployeeID,
                                   EmployeeName = st.EmployeeName,
                                   CumulativeHour = st.CumulativeHour,
                                   InTime = st.InTime,
                                   OutTime = st.OutTime,
                                   TotalMinutes = st.TotalMinutes,
                                   LunchTime = st.LunchTime,
                                   Date = st.Date,
                                   Status = st.Status,
                                   LateMinutes = st.LateMinutes,
                                   OTMinutes = st.OTMinutes


                               }).ToList();

            if (dReport.IsLate == true)
            {
                filterdList = filterdList.Where(f => f.Status == "D").ToList();
            }
            return filterdList;
        }

        public AttendanceViewModel GetDailyAttendance(SearchAttendanceViewModel searchVM, int branchId)
        {


            var query = $"EXEC ScopoHR..GetAttendanceData '{searchVM.FromDate.ToString()}', '{searchVM.FromDate.ToString()}','', '{branchId}','','{searchVM.CardNo}'";
            List<AttendanceDataViewModel> data = unitOfWork.UserRepository.SelectQuery<AttendanceDataViewModel>(query).ToList();

            if (data.Count > 0)
            {
                var result = new AttendanceViewModel
                {
                    CardNo = data.FirstOrDefault().CardNo,
                    EmployeeName = data[0].EmployeeName,
                    InTime = data[0].InTime,
                    InTimeDate = data[0].InTimeDate == null ? searchVM.FromDate.Date : Convert.ToDateTime(data[0].InTimeDate),
                    OutTime = data[0].OutTime == null ? null : data[0].OutTime,
                    OutTimeDate = data[0].OutTimeDate == null ? searchVM.FromDate.Date : Convert.ToDateTime(data[0].OutTimeDate),
                    Remarks = data[0].Remarks,
                };

                return result;
            }
            else
            {
                var empInfo = (from emp in _context.Employees
                               join cm in _context.CardNoMappings on emp.CardNo equals cm.OriginalCardNo
                               where emp.CardNo == searchVM.CardNo
                               select new AttendanceViewModel
                               {
                                   CardNo = emp.CardNo,
                                   EmployeeName = emp.EmployeeName,
                                   InTime = null,
                                   InTimeDate = searchVM.FromDate.Date,
                                   OutTime = null,
                                   OutTimeDate = searchVM.FromDate.Date,
                                   HasAttendance = 0
                               }).SingleOrDefault();
                return empInfo;
            }

        }

        public void Save(AttendanceViewModel at, string userName)
        {
            var generatedCardNo = _context.CardNoMappings.Where(x => x.OriginalCardNo == at.CardNo).SingleOrDefault();

            if (at.OutTime == null)
            {
               var attendance = new Attendance
                {
                    CardNo = generatedCardNo.GeneratedCardNo,
                    InOutTime = Convert.ToDateTime(at.InTimeDate).Date + Convert.ToDateTime(at.InTime).TimeOfDay,
                    ModifiedBy = userName,
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    Remarks = at.Remarks
                };
                _context.Attendances.Add(attendance);
                _context.SaveChanges();
            }
            else
            {
                //for intime entry
               var InTimeAttendance = new Attendance
                {
                    CardNo = generatedCardNo.GeneratedCardNo,
                    InOutTime = Convert.ToDateTime(at.InTimeDate).Date + Convert.ToDateTime(at.InTime).TimeOfDay,
                    ModifiedBy = userName,
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    Remarks = at.Remarks
                };
                _context.Attendances.Add(InTimeAttendance);

                //for out time entry
                var OutTimeAttendance = new Attendance
                {
                    CardNo = generatedCardNo.GeneratedCardNo,
                    InOutTime = Convert.ToDateTime(at.OutTimeDate).Date + Convert.ToDateTime(at.OutTime).TimeOfDay,
                    ModifiedBy = userName,
                    IsDeleted = false,
                    LastModified = DateTime.Now,
                    Remarks = at.Remarks
                };
                _context.Attendances.Add(OutTimeAttendance);
                _context.SaveChanges();

            }

        }

        public void DeleteAttendance(AttendanceViewModel attendance, string userName)
        {
            var generatedCardNo = _context.CardNoMappings.Where(x => x.OriginalCardNo == attendance.CardNo).SingleOrDefault();



            var attendanceList = _context.Attendances.Where(y => (DbFunctions.TruncateTime(y.InOutTime)) == DbFunctions.TruncateTime(attendance.InTimeDate) && y.CardNo == generatedCardNo.GeneratedCardNo).ToList();
            if (attendanceList.Count() > 0)
            {
                foreach (var att in attendanceList)
                {
                    att.IsDeleted = true;
                    att.ModifiedBy = userName;
                    att.LastModified = DateTime.Now;

                    _context.Attendances.Attach(att);
                    _context.Entry(att).State = EntityState.Modified;

                }
            }

            _context.SaveChanges();
        }



    }
}
