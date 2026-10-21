using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class SectionViewModel
    {
        public int SectionID { get; set; }

        public string SectionName { get; set; }

        public string Caption { get; set; }
        public string From { get; set; }

        public string To { get; set; }


    }
}
