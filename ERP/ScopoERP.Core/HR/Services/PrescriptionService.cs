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
    public class PrescriptionService
    {
        private HRContext _context;
        private Prescription prescription;

        public PrescriptionService(HRContext context)
        {
            this._context = context;
        }

        public void Update(PrescriptionViewModel prescriptionVM)
        {
            var existingPrescription = _context.Prescriptions.FirstOrDefault(p => p.PrescriptionID == prescriptionVM.PrescriptionID);


            if (existingPrescription != null)
            {
                existingPrescription.EmployeeID = prescriptionVM.EmployeeID;
                existingPrescription.Description = prescriptionVM.Description;
                existingPrescription.PrescribedDate = prescriptionVM.PrescribedDate;
                existingPrescription.Pulse = prescriptionVM.Pulse;
                existingPrescription.Anaemia = prescriptionVM.Anaemia;
                existingPrescription.BP = prescriptionVM.BP;
                existingPrescription.Dehydretion = prescriptionVM.Dehydretion;
                existingPrescription.Eyes = prescriptionVM.Eyes;
                existingPrescription.Heart = prescriptionVM.Heart;
                existingPrescription.Jaundice = prescriptionVM.Jaundice;
                existingPrescription.Lungs = prescriptionVM.Lungs;
                existingPrescription.Oeadema = prescriptionVM.Oeadema;
                existingPrescription.Others = prescriptionVM.Others;
                existingPrescription.PAbdomen = prescriptionVM.PAbdomen;
                existingPrescription.PatientStatement = prescriptionVM.PatientStatement;
                existingPrescription.Respiration = prescriptionVM.Respiration;
                existingPrescription.Skin = prescriptionVM.Skin;
                existingPrescription.Temperature = prescriptionVM.Temperature;
                existingPrescription.IsDeleted = false;
                existingPrescription.LastModified = DateTime.Now;
                existingPrescription.ModifiedBy = prescriptionVM.ModifiedBy;

                _context.Prescriptions.Attach(existingPrescription);
                _context.Entry(existingPrescription).State = EntityState.Modified;
                _context.SaveChanges();
            }
        }

        public void Create(PrescriptionViewModel prescriptionVM)
        {
            prescription = new Prescription
            {
                EmployeeID = prescriptionVM.EmployeeID,
                Description = prescriptionVM.Description,
                PrescribedDate = prescriptionVM.PrescribedDate,
                Pulse = prescriptionVM.Pulse,
                Anaemia = prescriptionVM.Anaemia,
                BP = prescriptionVM.BP,
                Dehydretion = prescriptionVM.Dehydretion,
                Eyes = prescriptionVM.Eyes,
                Heart = prescriptionVM.Heart,
                Jaundice = prescriptionVM.Jaundice,
                Lungs = prescriptionVM.Lungs,
                Oeadema = prescriptionVM.Oeadema,
                Others = prescriptionVM.Others,
                PAbdomen = prescriptionVM.PAbdomen,
                PatientStatement = prescriptionVM.PatientStatement,
                Respiration = prescriptionVM.Respiration,
                Skin = prescriptionVM.Skin,
                Temperature = prescriptionVM.Skin,
                IsDeleted = false,
                LastModified = DateTime.Now,
                ModifiedBy = prescriptionVM.ModifiedBy
            };
            _context.Prescriptions.Add(prescription);
            _context.SaveChanges();
        }

        public List<PrescriptionViewModel> GetRecentPrescriptionList()
        {
            List<PrescriptionViewModel> list = (from p in _context.Prescriptions
                                                join e in _context.Employees on p.EmployeeID equals e.EmployeeID
                                                select new PrescriptionViewModel
                                                {
                                                    PrescriptionID = p.PrescriptionID,
                                                    EmployeeName = e.EmployeeName,
                                                    CardNo = e.CardNo,
                                                    EmployeeID = p.EmployeeID,
                                                    Description = p.Description,
                                                    PrescribedDate = p.PrescribedDate,
                                                    Pulse = p.Pulse,
                                                    Anaemia = p.Anaemia,
                                                    BP = p.BP,
                                                    Dehydretion = p.Dehydretion,
                                                    Eyes = p.Eyes,
                                                    Heart = p.Heart,
                                                    Jaundice = p.Jaundice,
                                                    Lungs = p.Lungs,
                                                    Oeadema = p.Oeadema,
                                                    Others = p.Others,
                                                    PAbdomen = p.PAbdomen,
                                                    PatientStatement = p.PatientStatement,
                                                    Respiration = p.Respiration,
                                                    Skin = p.Skin,
                                                    Temperature = p.Skin
                                                }).OrderByDescending(x=>x.PrescriptionID).Take(50).ToList();
            return list;
        }

 
    }
}
