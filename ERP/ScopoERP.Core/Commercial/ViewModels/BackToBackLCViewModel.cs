using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ScopoERP.Commercial.ViewModel
{
    public class BackToBackLCViewModel
    {
        public BackToBackLCViewModel() 
        {
            PIList = new List<PISummary>();
        }

        public int BackToBackLCID { get; set; }

        [Required(AllowEmptyStrings = false)]
        public string BackToBackLCNo { get; set; }

        public DateTime? BackToBackLCDate { get; set; }
        public decimal? BackToBackLCValue { get; set; }
        public DateTime? BackToBackShippedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string ShipmentTo { get; set; }
        public string ShipmentFrom { get; set; }
        public int? ShipMode { get; set; }
        public string Clause { get; set; }
        public string InsuranceCoverNoteNo { get; set; }
        public DateTime? InsuranceCoverNoteDate { get; set; }
        public string HSCode { get; set; }
        public string CountryOfOrigin { get; set; }
        public string LCAFormNo { get; set; }

        public int? SightDays { get; set; }
        public DateTime? MaturityDate { get; set; }

        [Required]
        public int? JobID { get; set; }
        public string JobNo { get; set; }

        public bool Status { get; set; }

        [Required]
        public int? LCTypeID { get; set; }
        public string LCTypeTitle { get; set; }
        public bool EFD { get; set; }

        public decimal? AcceptanceValue { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public decimal? TotalPaymentValue { get; set; }

        public bool Amendment { get; set; }
        public int? AmendmentNo { get; set; }
       
        public DateTime? AmendmentDate { get; set; }
        public decimal? B2BLCPreviousValue { get; set; }
      
        public int? MaturityType { get; set; }

        public List<PISummary> PIList { get; set; }
        public List<AmendmentViewModel> AmendmentList { get; set; }
    }

    public class PISummary
    {
        public int? PIID { get; set; }
        public string PINo { get; set; }
        public decimal PIValue { get; set; }
    }

    public class AmendmentViewModel
    {
        public int? AmendmentNo { get; set; }
        public DateTime? AmendmentDate { get; set; }
        public decimal AmendmentValue { get; set; }
    }
}
