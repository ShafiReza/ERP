using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Reports.ViewModels
{
    public class EmployeeIdCardViewModel
    {
        public string CardNo { get; set; }
        public string IssedDate { get; set; }
        public string CompanyName { get; set; }
        public string EmployeeName { get; set; }
        public int EmployeeID { get; set; }
        public string EmployeeNameBN { get; set; }
        public string DesignationName { get; set; }
        public string DesignationNameBangla { get; set; }
        public string WorkingType { get; set; }
        public string WorkTypeEnglish { get; set; }
        public string DepartmentName { get; set; }
        public string DepartmentNameBangla { get; set; }
        public Nullable<DateTime> JoiningDate { get; set; }
        public int? Ticket { get; set; }
        public string Expiry { get; set; }
        public string Job { get; set; }
        public string BloodGroup { get; set; }
        public string CompanyAddress { get; set; }
        public string PermanentAddress { get; set; }
        public string PermanentAddressBN { get; set; }
        public string Telephone { get; set; }
        public string MobileNo { get; set; }
        public string EmergencyPhone { get; set; }
        public string NID { get; set; }
        public string Floor { get; set; }
        public string UniqueIdentifier { get; set; }
        public string FingerPrint { get; set; }

        public byte[] QRCode { get; set; }


    }
}
