using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.MaterialManagement.BLL
{
    public class ConsumptionUnitLogic
    {
        private UnitOfWork unitOfWork;
        private consumptionunit consumptionUnit;


        public ConsumptionUnitLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        public void CreateConsumptionUnit(ConsumptionUnitViewModel consumptionUnitVM)
        {
            consumptionUnit = new consumptionunit
            {
                UnitName = consumptionUnitVM.ConsumptionUnitName
            };

            unitOfWork.ConsumptionUnitRepository.Insert(consumptionUnit);
            unitOfWork.Save();
        }


        public void UpdateConsumptionUnit(ConsumptionUnitViewModel consumptionUnitVM)
        {
            consumptionUnit = new consumptionunit
            {
                ConsumptionUnitId = consumptionUnitVM.ConsumptionUnitID,
                UnitName = consumptionUnitVM.ConsumptionUnitName
            };

            unitOfWork.ConsumptionUnitRepository.Update(consumptionUnit);
            unitOfWork.Save();
        }


        public List<ConsumptionUnitViewModel> GetAllConsumptionUnit(string unitName)
        {
            var result = (from s in unitOfWork.ConsumptionUnitRepository.Get()
                          orderby s.ConsumptionUnitId descending
                          select new ConsumptionUnitViewModel
                          {
                              ConsumptionUnitID = s.ConsumptionUnitId,
                              ConsumptionUnitName = s.UnitName
                          }).AsQueryable();
            if(unitName != null)
                result = result.Where(x=>x.ConsumptionUnitName == unitName);

            return result.ToList();
        }


        public ConsumptionUnitViewModel GetConsumptionUnitByID(int id)
        {
            var result = (from s in unitOfWork.ConsumptionUnitRepository.Get()
                          where s.ConsumptionUnitId == id
                          select new ConsumptionUnitViewModel
                          {
                              ConsumptionUnitID = s.ConsumptionUnitId,
                              ConsumptionUnitName = s.UnitName
                          }).SingleOrDefault();

            return result;
        }


        public bool IsUniqueConsumptionUnit(string consumptionUnitName, Nullable<int> consumptionUnitID = null)
        {
            IQueryable<int> result;

            if (consumptionUnitID == null)
            {
                result = from s in unitOfWork.ConsumptionUnitRepository.Get()
                         where s.UnitName == consumptionUnitName
                         select s.ConsumptionUnitId;
            }
            else
            {
                result = from s in unitOfWork.ConsumptionUnitRepository.Get()
                         where s.UnitName == consumptionUnitName & s.ConsumptionUnitId != consumptionUnitID
                         select s.ConsumptionUnitId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
