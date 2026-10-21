using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Common.BLL
{
    public class FactoryLogic
    {
        private UnitOfWork unitOfWork;
        private factory factory;

        public FactoryLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateFactory(FactoryViewModel factoryVM)
        {
            factory = new factory
            {
                FactoryName = factoryVM.FactoryName
            };

            unitOfWork.FactoryRepository.Insert(factory);
            unitOfWork.Save();
        }

        public void UpdateFactory(FactoryViewModel factoryVM)
        {
            factory = new factory
            {
                FactoryId = factoryVM.FactoryID,
                FactoryName = factoryVM.FactoryName
            };

            unitOfWork.FactoryRepository.Update(factory);
            unitOfWork.Save();
        }

        public List<FactoryViewModel> GetAllFactory()
        {
            var result = (from s in unitOfWork.FactoryRepository.Get()
                          orderby s.FactoryId descending
                          select new FactoryViewModel
                          {
                              FactoryID = s.FactoryId,
                              FactoryName = s.FactoryName
                          }).ToList();

            return result;
        }

        public FactoryViewModel GetFactoryByID(int id)
        {
            var result = (from s in unitOfWork.FactoryRepository.Get()
                          where s.FactoryId == id
                          select new FactoryViewModel
                          {
                              FactoryID = s.FactoryId,
                              FactoryName = s.FactoryName
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueFactory(string factoryName, int? factoryID = null)
        {
            IQueryable<int> result;

            if (factoryID == null)
            {
                result = from s in unitOfWork.FactoryRepository.Get()
                         where s.FactoryName == factoryName
                         select s.FactoryId;
            }
            else
            {
                result = from s in unitOfWork.FactoryRepository.Get()
                         where s.FactoryName == factoryName & s.FactoryId != factoryID
                         select s.FactoryId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
