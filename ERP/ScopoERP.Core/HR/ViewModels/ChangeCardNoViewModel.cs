using ScopoERP.Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class ChangeCardNoViewModel : BaseEntity
    {
        [Required]
        public string OldCardNo { get; set; }
        [Required]
        public string NewCardNo { get; set; }
    }
}
