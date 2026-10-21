using ScopoERP.Core.Settings.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Settings.Services
{
    public class DefectTypeService
    {
        private UnitOfWork unitOfWork;
        private DefectType defectType;

        public DefectTypeService(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateDefectType(DefectTypeViewModel defectTypeVM)
        {
            defectType = new DefectType
            {
                DefectTypeName = defectTypeVM.DefectTypeName
            };

            unitOfWork.DefectTypeRepository.Insert(defectType);
            unitOfWork.Save();
        }

        public void UpdateDefectType(DefectTypeViewModel defectTypeVM)
        {
            defectType = new DefectType
            {
                ID = defectTypeVM.ID,
                DefectTypeName = defectTypeVM.DefectTypeName
            };

            unitOfWork.DefectTypeRepository.Update(defectType);
            unitOfWork.Save();
        }

        public List<DefectTypeViewModel> GetAllDefectTypes()
        {
            var result = (from s in unitOfWork.DefectTypeRepository.Get()
                          orderby s.ID descending
                          select new DefectTypeViewModel
                          {
                             ID = s.ID,
                             DefectTypeName = s.DefectTypeName
                          }).ToList();

            return result;
        }
    }
}
