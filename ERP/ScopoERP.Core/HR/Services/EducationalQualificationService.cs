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
    public class EducationalQualificationService
    {
        private HRContext _context;

        public EducationalQualificationService(HRContext context)
        {
            this._context = context;
        }

        public List<EducationalQualificationViewModel> GetAllEducationQualification()
        {
            var result = (from e in _context.EducationalQualification
                          select new EducationalQualificationViewModel
                          {
                              ID = e.ID,
                              Qualification = e.Qualification,
                              QualificationBN = e.QualificationBN
                          }).OrderByDescending(x=>x.ID).ToList();
            return result;
        }

        public EducationalQualificationViewModel GetAllEducationQualificationById(int Id)
        {
            var result = (from e in _context.EducationalQualification
                          where e.ID == Id
                          select new EducationalQualificationViewModel
                          {
                              ID = e.ID,
                              Qualification = e.Qualification,
                              QualificationBN = e.QualificationBN
                          }).FirstOrDefault();
            return result;
        }

        public void UpdateEducatiuonQualification(EducationalQualificationViewModel eQVm)
        {
            if (eQVm.ID == 0)
            {
                // Adding a new EducationalQualification
                var educationQualification = new EducationalQualification
                {
                    Qualification = eQVm.Qualification,
                    QualificationBN = eQVm.QualificationBN
                };

                _context.EducationalQualification.Add(educationQualification);
            }
            else
            {
                // Updating an existing EducationalQualification
                var existEducationQualification = _context.EducationalQualification
                                                     .FirstOrDefault(eq => eq.ID == eQVm.ID);
                if (existEducationQualification != null)
                {
                    existEducationQualification.Qualification = eQVm.Qualification;
                    existEducationQualification.QualificationBN = eQVm.QualificationBN;

                    _context.EducationalQualification.Attach(existEducationQualification);
                    _context.Entry(existEducationQualification).State = EntityState.Modified;
                }
            }

            _context.SaveChanges();

        }

        public bool IsUnique(EducationalQualificationViewModel eQVM)
        {
            IQueryable<int> result;

            if (eQVM.ID == 0)
            {
                result = from e in _context.EducationalQualification
                         where e.Qualification == eQVM.Qualification
                         select e.ID;
            }
            else
            {
                result = from e in _context.EducationalQualification
                         where e.ID != eQVM.ID && e.Qualification == eQVM.Qualification
                         select e.ID;
            }

            return result.Count() > 0 ? false : true;
        }
    }
}
