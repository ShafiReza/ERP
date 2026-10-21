using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Domain.Models.HR
{
    public class Branch : BaseEntity
    {
        public int BranchID { get; set; }
        public string BranchName { get; set; }
        public string BranchNameBN { get; set; }
        public string BranchAddress { get; set; }
        public string CompanyAddress { get; set; }
        public string BranchEmail { get; set; }
        public string BranchPhone { get; set; }
        public string BranchFax { get; set; }
        public bool IsCompany { get; set; }
        public bool IsHeadOffice { get; set; }
        public string CompanyAddressBN { get; set; }
    }
}
