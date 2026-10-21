using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using Section = ScopoERP.Domain.Models.HR.Section;

namespace ScopoERP.Core.HR.Services
{
    public class SectionService
    {
        private HRContext _context;

        public SectionService(HRContext context)
        {
            _context = context;
        }
        public List<SectionViewModel> GetAll()
        {
            var data = (from s in _context.Sections
                        select new SectionViewModel
                        {
                          SectionID = s.SectionID,
                          SectionName= s.SectionName,
                          Caption=s.Caption,
                          From = s.From,
                          To= s.To,
                        }).OrderByDescending(x => x.SectionID)
                        .ToList();
            return data;
        }

        public void CreateSection(SectionViewModel sectionVM)
        {

            var section = new Section
            {
                SectionName = sectionVM.SectionName,
                Caption = sectionVM.Caption,
                From = sectionVM.From,
                To = sectionVM.To
            };
            _context.Sections.Add(section);
            _context.SaveChanges();
        }

        public void UpdateSection(SectionViewModel sectionVM)
        {


            var entity = _context.Sections.Find(sectionVM.SectionID);
            if (entity != null)
            {
               
                entity.SectionID = sectionVM.SectionID;
                entity.SectionName = sectionVM.SectionName;
                entity.Caption = sectionVM.Caption;
                entity.From = sectionVM.From;
                entity.To = sectionVM.To;

             
                _context.Entry(entity).State = EntityState.Modified;

              
                _context.SaveChanges();
            }
        }

        public void DeleteSection(SectionViewModel sectionVM)
        {


            var entity = _context.Sections.Find(sectionVM.SectionID);
            if (entity != null)
            {

                _context.Sections.Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}
