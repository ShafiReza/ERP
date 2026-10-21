using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class AttendanceViewModel
    {
        public string Day { get; set; }
        public DateTime? Date { get; set; }
        public string InTime { get; set; }
        public string OutTime { get; set; }
        public DateTime? InTimeDate { get; set; }
        public DateTime? OutTimeDate { get; set; }
        public int? WorkingHours { get; set; }
        public int? OTMinutes { get; set; }
        public string Status { get; set; }
        public int LunchTime { get; set; }
        public string CardNo { get; set; }
        public string EmployeeName { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string DesignationName { get; set; }
        public string DepartmentName { get; set; }
        public string Floor { get; set; }
        public DateTime? JoinDate { get; set; }
        public string DutyTime { get; set; }
        public string Remarks { get; set; }
        public int? HasAttendance { get; set; }
    }

    public class AttendanceSummaryViewModel
    {
        public string SectionName { get; set; }
        public int TotalWorkers { get; set; }
        public int TotalMinutes { get; set; }
    }

    public class DailyAttendanceSummaryViewModel
    {
        public int AbsentDays { get; set; }
        public int Budget { get; set; }
        public int TotalPresent { get; set; }
        public int NoLine { get; set; }
        public int Leave { get; set; }
        public int Late { get; set; }
        public int GrandTotal { get; set; }
        public int Male { get; set; }
        public int Female { get; set; }
        public string Section { get; set; }
        public int Code { get; set; }
    }

    public class SearchAttendanceViewModel
    {
        [Required]
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string CardNo { get; set; }
        public string FloorName { get; set; }
        public bool AbsentOnly { get; set; }
        public string ShiftId { get; set; }
    }

    public class AttendanceReportViewModel
    {
        public string CardNo { get; set; }
        public string EmployeeName { get; set; }
        public string DesignationName { get; set; }
        public string Remarks { get; set; }
        public DateTime Date { get; set; }
        public DateTime InTime { get; set; }
        public DateTime OutTime { get; set; }
        public string Status { get; set; }
        public int OverTime { get; set; }
        public string Floor { get; set; }
    }

    public class AttendanceDataViewModel
    {
        public int AttendanceID { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime InOutTime { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string EmployeeName { get; set; }
        public string CardNo { get; set; }
        public string InTime { get; set; }
        public string OutTime { get; set; }
        public string Remarks { get; set; }

        public string Day { get; set; }
        public int? WorkingHours { get; set; }
        public int? OTMinutes { get; set; }
        public int LunchTime { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string InTimeDate { get; set; }
        public string OutTimeDate { get; set; }
    }
}
