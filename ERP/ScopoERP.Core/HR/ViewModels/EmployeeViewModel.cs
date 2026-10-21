using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class EmployeeViewModel
    {
        public int EmployeeID { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeNameBN { get; set; }
        public string CardNo { get; set; }
        public int? DesignationID { get; set; }
        public int? DepartmentID { get; set; }
        public string DepartmentName { get; set; }
        public string DesignationName { get; set; }
        public string MobileNo { get; set; }
     
        public string MFSType { get; set; }
        public string MFSNo { get; set; }
        public string SpouseName { get; set; }
        public string SpouseNameBN { get; set; }

        public int? ShiftId { get; set; }
        public string ShiftName { get; set; }

        public string PresentAddress { get; set; }
        public string PresentAddressBN { get; set; }
        public string PermanentAddress { get; set; }
        public string PermanentAddressBN { get; set; }
        public string Email { get; set; }
        public string NID { get; set; }
        public string BirthCertificateNo { get; set; }
        public string BloodGroup { get; set; }
        public string GrandFatherName { get; set; }
        public string GrandFatherNameBN { get; set; }
        public string FatherName { get; set; }
        public string FatherNameBN { get; set; }
        public string MotherName { get; set; }
        public string MotherNameBN { get; set; }
        public string NomineeName { get; set; }
        public string RelationWithNominee { get; set; }
        public string ReferrerOne { get; set; }
        public string ReferrerOneBN { get; set; }
        public string ReferrerTwo { get; set; }
        public string ReferrerTwoBN { get; set; }
        public string ReferrerThree { get; set; }
        public string ReferrerThreeBN { get; set; }
        public int? Religion { get; set; }
        public int? EducationalQualification { get; set; }
        public int? ReferenceID { get; set; }
        public int? ReportToID { get; set; }
        public short? SalaryGrade { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public DateTime? JoinDate { get; set; }

        public int? BranchID { get; set; }
        public int GenderID { get; set; }
        public string BranchName { get; set; }
        public bool? IsActive { get; set; }
        public bool? OTApplicable { get; set; }
        public bool? AttendanceBonusApplicable { get; set; }
        public int? TicketNo { get; set; }
        public int? EmployeeType { get; set; }
        public int? SectionID { get; set; }
        public int? MaritalStatus { get; set; }
        public int? ProductionFloorLineID { get; set; }
        public string SectionName { get; set; }
        public string ProductionFloorLineName { get; set; }
        public string EmployeePreviousHistory { get; set; }
        public string EmergencyContactNo { get; set; }
        public string NIDPhoto { get; set; }
    }
}
