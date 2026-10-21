using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class MedicalRecordService
    {

        private HRContext _context;

        public MedicalRecordService(HRContext context)
        {
            this._context = context;
        }

        public void Create(MedicalRecordViewModel empVM)
        {
            var Med = new MedicalRecord
            {
                EmployeeID = empVM.EmployeeID,
                AgeOfFirstChild = empVM.AgeOfFirstChild,
                Anemia = empVM.Anemia,
                Beard = empVM.Beard,
                BodyTemperautre = empVM.BodyTemperautre,
                BodyWeight = empVM.BodyWeight,
                BP = empVM.BP,
                CongenitalMarks = empVM.CongenitalMarks,
                CXR = empVM.CXR,
                Diesease = empVM.Diesease,
                Ear = empVM.Ear,
                ECG = empVM.ECG,
                Eye = empVM.Eye,
                FamilialDiesease = empVM.FamilialDiesease,
                Hearing = empVM.Hearing,
                Heart = empVM.Heart,
                Height = empVM.Height,
                Jaundice = empVM.Jaundice,
                Kedneys = empVM.Kedneys,
                Liver = empVM.Liver,
                LMP = empVM.LMP,
                Lungs = empVM.Lungs,
                LympGlands = empVM.LympGlands,
                MensLife = empVM.MensLife,
                MentalState = empVM.MentalState,
                Moustache = empVM.Moustache,
                Nose = empVM.Nose,
                Other = empVM.Other,
                Others = empVM.Others,
                PhysicalDisability = empVM.PhysicalDisability,
                Pregnant = empVM.Pregnant,
                PulseRate = empVM.PulseRate,
                RespirationRate = empVM.RespirationRate,
                Skin = empVM.Skin,
                Spleen = empVM.Spleen,
                TeethDn = empVM.TeethDn,
                TeethUp = empVM.TeethUp,
                ThyroidGlands = empVM.ThyroidGlands,
                Tonsil = empVM.Tonsil,
                TTgiven = empVM.TTgiven,
                Vaccine = empVM.Vaccine,
                VDRL = empVM.VDRL,
                Vision = empVM.Vision,
                NoOfChild = empVM.NoOfChild,
                Onpil = empVM.Onpil
            };
            _context.MedicalRecord.Add(Med);
            _context.SaveChanges();
        }

        public MedicalRecordViewModel GetByCardNo(int ID)
        {
            var data = (from m in _context.MedicalRecord
                        where m.EmployeeID == ID
                        select new MedicalRecordViewModel
                        {
                            MedicalRecordID = m.MedicalRecordID,
                            EmployeeID = m.EmployeeID,
                            AgeOfFirstChild = m.AgeOfFirstChild,
                            Anemia = m.Anemia,
                            Beard = m.Beard,
                            BodyTemperautre = m.BodyTemperautre,
                            BodyWeight = m.BodyWeight,
                            BP = m.BP,
                            CongenitalMarks = m.CongenitalMarks,
                            CXR = m.CXR,
                            Diesease = m.Diesease,
                            Ear = m.Ear,
                            ECG = m.ECG,
                            Eye = m.Eye,
                            FamilialDiesease = m.FamilialDiesease,
                            Hearing = m.Hearing,
                            Heart = m.Heart,
                            Height = m.Height,
                            Jaundice = m.Jaundice,
                            Kedneys = m.Kedneys,
                            Liver = m.Liver,
                            LMP = m.LMP,
                            Lungs = m.Lungs,
                            LympGlands = m.LympGlands,
                            MensLife = m.MensLife,
                            MentalState = m.MentalState,
                            Moustache = m.Moustache,
                            Nose = m.Nose,
                            Other = m.Other,
                            Others = m.Others,
                            PhysicalDisability = m.PhysicalDisability,
                            Pregnant = m.Pregnant,
                            PulseRate = m.PulseRate,
                            RespirationRate = m.RespirationRate,
                            Skin = m.Skin,
                            Spleen = m.Spleen,
                            TeethDn = m.TeethDn,
                            TeethUp = m.TeethUp,
                            ThyroidGlands = m.ThyroidGlands,
                            Tonsil = m.Tonsil,
                            TTgiven = m.TTgiven,
                            Vaccine = m.Vaccine,
                            VDRL = m.VDRL,
                            Vision = m.Vision,
                            Onpil = m.Onpil,
                            NoOfChild = m.NoOfChild
                        }).SingleOrDefault();


            return data;
        }

        public List<MedicalRecordViewModel> GetAllRecord()
        {
            var data = (from m in _context.MedicalRecord
                        join e in _context.Employees on m.EmployeeID equals e.EmployeeID
                        orderby m.MedicalRecordID descending
                        select new MedicalRecordViewModel
                        {
                            MedicalRecordID = m.MedicalRecordID,
                            EmployeeID = m.EmployeeID,
                            EmployeeName = e.EmployeeName,
                            CardNo= e.CardNo,
                            AgeOfFirstChild = m.AgeOfFirstChild,
                            Anemia = m.Anemia,
                            Beard = m.Beard,
                            BodyTemperautre = m.BodyTemperautre,
                            BodyWeight = m.BodyWeight,
                            BP = m.BP,
                            CongenitalMarks = m.CongenitalMarks,
                            CXR = m.CXR,
                            Diesease = m.Diesease,
                            Ear = m.Ear,
                            ECG = m.ECG,
                            Eye = m.Eye,
                            FamilialDiesease = m.FamilialDiesease,
                            Hearing = m.Hearing,
                            Heart = m.Heart,
                            Height = m.Height,
                            Jaundice = m.Jaundice,
                            Kedneys = m.Kedneys,
                            Liver = m.Liver,
                            LMP = m.LMP,
                            Lungs = m.Lungs,
                            LympGlands = m.LympGlands,
                            MensLife = m.MensLife,
                            MentalState = m.MentalState,
                            Moustache = m.Moustache,
                            Nose = m.Nose,
                            Other = m.Other,
                            Others = m.Others,
                            PhysicalDisability = m.PhysicalDisability,
                            Pregnant = m.Pregnant,
                            PulseRate = m.PulseRate,
                            RespirationRate = m.RespirationRate,
                            Skin = m.Skin,
                            Spleen = m.Spleen,
                            TeethDn = m.TeethDn,
                            TeethUp = m.TeethUp,
                            ThyroidGlands = m.ThyroidGlands,
                            Tonsil = m.Tonsil,
                            TTgiven = m.TTgiven,
                            Vaccine = m.Vaccine,
                            VDRL = m.VDRL,
                            Vision = m.Vision,
                            Onpil = m.Onpil,
                            NoOfChild = m.NoOfChild
                        }).ToList();


            return data;
        }

        public void Update(MedicalRecordViewModel empVM)
        {
            // Retrieve the existing medical record from the database using the MedicalRecordID
            var existingMedicalRecord = _context.MedicalRecord.FirstOrDefault(m => m.MedicalRecordID == empVM.MedicalRecordID);

            // Check if the existing medical record is found
            if (existingMedicalRecord != null)
            {
                // Update the properties of the existing medical record
                existingMedicalRecord.EmployeeID = empVM.EmployeeID;
                existingMedicalRecord.AgeOfFirstChild = empVM.AgeOfFirstChild;
                existingMedicalRecord.Anemia = empVM.Anemia;
                existingMedicalRecord.Beard = empVM.Beard;
                existingMedicalRecord.BodyTemperautre = empVM.BodyTemperautre;
                existingMedicalRecord.BodyWeight = empVM.BodyWeight;
                existingMedicalRecord.BP = empVM.BP;
                existingMedicalRecord.CongenitalMarks = empVM.CongenitalMarks;
                existingMedicalRecord.CXR = empVM.CXR;
                existingMedicalRecord.Diesease = empVM.Diesease;
                existingMedicalRecord.Ear = empVM.Ear;
                existingMedicalRecord.ECG = empVM.ECG;
                existingMedicalRecord.Eye = empVM.Eye;
                existingMedicalRecord.FamilialDiesease = empVM.FamilialDiesease;
                existingMedicalRecord.Hearing = empVM.Hearing;
                existingMedicalRecord.Heart = empVM.Heart;
                existingMedicalRecord.Height = empVM.Height;
                existingMedicalRecord.Jaundice = empVM.Jaundice;
                existingMedicalRecord.Kedneys = empVM.Kedneys;
                existingMedicalRecord.Liver = empVM.Liver;
                existingMedicalRecord.LMP = empVM.LMP;
                existingMedicalRecord.Lungs = empVM.Lungs;
                existingMedicalRecord.LympGlands = empVM.LympGlands;
                existingMedicalRecord.MensLife = empVM.MensLife;
                existingMedicalRecord.MentalState = empVM.MentalState;
                existingMedicalRecord.Moustache = empVM.Moustache;
                existingMedicalRecord.Nose = empVM.Nose;
                existingMedicalRecord.Other = empVM.Other;
                existingMedicalRecord.Others = empVM.Others;
                existingMedicalRecord.PhysicalDisability = empVM.PhysicalDisability;
                existingMedicalRecord.Pregnant = empVM.Pregnant;
                existingMedicalRecord.PulseRate = empVM.PulseRate;
                existingMedicalRecord.RespirationRate = empVM.RespirationRate;
                existingMedicalRecord.Skin = empVM.Skin;
                existingMedicalRecord.Spleen = empVM.Spleen;
                existingMedicalRecord.TeethDn = empVM.TeethDn;
                existingMedicalRecord.TeethUp = empVM.TeethUp;
                existingMedicalRecord.ThyroidGlands = empVM.ThyroidGlands;
                existingMedicalRecord.Tonsil = empVM.Tonsil;
                existingMedicalRecord.TTgiven = empVM.TTgiven;
                existingMedicalRecord.Vaccine = empVM.Vaccine;
                existingMedicalRecord.VDRL = empVM.VDRL;
                existingMedicalRecord.Vision = empVM.Vision;
                existingMedicalRecord.NoOfChild = empVM.NoOfChild;
                existingMedicalRecord.Onpil = empVM.Onpil;

                // Attach the existing medical record to the context and mark it as modified
                _context.MedicalRecord.Attach(existingMedicalRecord);
                _context.Entry(existingMedicalRecord).State = EntityState.Modified;

                // Save the changes to the database
                _context.SaveChanges();
            }
        }
    }
}
