using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.ViewModels
{
    public class VoterViewModel
    {
        public class BRNMaster
        {
            public string passKyc { get; set; }
            public string errorCode { get; set; }

            public string registrationFound { get; set; }
            public BirthRecord birthRecord { get; set; }
            public object errorResponse { get; set; }
        }

        public class BirthRecord
        {
            public string personNameBN { get; set; }
            public string personNameEN { get; set; }
            public string motherNameBN { get; set; }
            public string motherNameEN { get; set; }
            public string motherNatBN { get; set; }
            public string motherNatEN { get; set; }
            public string fatherNameBN { get; set; }
            public string fatherNameEN { get; set; }
            public string fatherNatBN { get; set; }
            public string fatherNatEN { get; set; }
            public string placeOfBirthBN { get; set; }
            public string placeOfBirthEN { get; set; }
        }


        public class NIDMaster
        {
            public string transactionId { get; set; }
            public int creditCost { get; set; }
            public int creditCurrent { get; set; }
            public string status { get; set; }
            public Data data { get; set; }
            public List<Error> errors { get; set; }
        }

        public class Nid
        {
            public string fullNameEN { get; set; }
            public string fathersNameEN { get; set; }
            public string mothersNameEN { get; set; }
            public string presentAddressEN { get; set; }
            public string permenantAddressEN { get; set; }
            public string fullNameBN { get; set; }
            public string fathersNameBN { get; set; }
            public string mothersNameBN { get; set; }
            public string spouseNameBN { get; set; }
            public string presentAddressBN { get; set; }
            public string permanentAddressBN { get; set; }
            public string gender { get; set; }
            public string profession { get; set; }
            public DateTime dateOfBirth { get; set; }
            public string nationalIdNumber { get; set; }
            public string oldNationalIdNumber { get; set; }
            public string photoUrl { get; set; }
        }

        public class Data
        {
            public Nid nid { get; set; }
        }

        public class Error
        {
            public string code { get; set; }
            public string message { get; set; }
        }
    }
}
