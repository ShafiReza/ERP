using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class ReportFilteringViewModel
    {
        public Nullable<DateTime> FromDate { get; set; }
        public Nullable<DateTime> ToDate { get; set; }
        public string Floor { get; set; }
        public int ProductionFloorLineID { get; set; }
        public int Decision { get; set; }
        public string DecisionName { get; set; }
        public string EmployeeID { get; set; }
        public int? ShiftId { get; set; }
        public int? Tofshil { get; set; }
        public string CardNo { get; set; }
        public int? ReportType { get; set; }
        public decimal? BasicSalary { get; set; }
        public decimal? OtRate { get; set; }
        public decimal? TotalSalary { get; set; }
        public int Month { get; set; }
        public int DepartmentID { get; set; }
        public int Days { get; set; }
        public int FirstMonth { get; set; }
        public int SecondMonth { get; set; }
        public int EmployeeType { get; set; }
        public string BankName { get; set; }
        public string Company { get; set; }
        public int DropOut { get; set; }
        public int BankSalary { get; set; }
        public int IsActive { get; set; }
        public bool IsTempIDCard { get; set; }
        public int Year { get; set; }
        public int FirstYear { get; set; }
        public int SecondYear { get; set; }
        public int LeaveApplicationID { get; set; }
        public DateTime? InTime { get; set; }
        public DateTime? OutTime { get; set; }
        public bool LeaveTypeReport { get; set; }
        public int DesignationID { get; set; }
        public Int16 SalaryGrade { get; set; }
        public int GenderID { get; set; }
        public bool FirstInstallment { get; set; }
        public int MaternityID { get; set; }
        public int TotalEmployee { get; set; }
        public int PrescriptionID { get; set; }
        public string EmployeeNameBN { get; set; }
        public string FatherNameBN { get; set; }
        public string MotherNameBN { get; set; }
        public string PresentAddressBN { get; set; }
        public string PermanentAddressBN { get; set; }

        public int InActiveType { get; set; }
        public string InActiveTypeName { get; set; }

        public string JobCircularCondition { get; set; }
        public int SectionID { get; set; }
        public string SectionName { get; set; }

        public string CompanyName { get; set; }
        public string CompanyNameBN { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyAddressBN { get; set; }
        public int? IdCardType { get; set; }
        public int? OtHour { get; set; }
        public DateTime? NoticeDate { get; set; }
        public DateTime? ResignDate { get; set; }
        public string Reason { get; set; }
        public string DesignationName { get; set; }


    }
}
