using System;

namespace ScopoERP.API.Common.ViewModels
{
    public class SupportTicketViewModel
    {
        public int ID { get; set; }
        public string TokenNo { get; set; }      
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string IssueType { get; set; }
        public string Details { get; set; }
        public string AssignTo { get; set; }
        public string Department { get; set; }
        

        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }
    }
}
