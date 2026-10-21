using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Production.ViewModel;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Production.BLL
{
    public class ProductionFloorLogic
    {
        private UnitOfWork unitOfWork;
        private floorline producttionFloor;

        public ProductionFloorLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateProductionFloor(ProductionFloorViewModel productionFloorVM)
        {
            producttionFloor = new floorline
            {
                Floor = productionFloorVM.Floor,
                Line = productionFloorVM.Line,
                Devision = productionFloorVM.Division,
                Status = productionFloorVM.Status
            };

            unitOfWork.ProductionFloorRepository.Insert(producttionFloor);
            unitOfWork.Save();
        }

        public void UpdateProductionFloor(ProductionFloorViewModel productionFloorVM)
        {
            producttionFloor = new floorline
            {
                FloorLineId = productionFloorVM.ProductionFloorID,
                Floor = productionFloorVM.Floor,
                Line = productionFloorVM.Line,
                Devision = productionFloorVM.Division,
                Status = productionFloorVM.Status
            };

            unitOfWork.ProductionFloorRepository.Update(producttionFloor);
            unitOfWork.Save();
        }

        public List<ProductionFloorViewModel> GetAllProductionFloor()
        {
            var result = (from s in unitOfWork.ProductionFloorRepository.Get()
                          where s.Status == 1
                          select new ProductionFloorViewModel
                          {
                              ProductionFloorID = s.FloorLineId,
                              Floor = s.Floor,
                              Line = s.Line,
                              Division = s.Devision,
                              Status = s.Status,
                          }).OrderBy(x => x.Floor).ThenBy(x => x.Line).ToList();

            return result;
        }

        public ProductionFloorViewModel GetProductionFloorByID(int id)
        {
            var result = (from s in unitOfWork.ProductionFloorRepository.Get()
                          where s.FloorLineId == id & s.Status == 1
                          select new ProductionFloorViewModel
                          {
                              ProductionFloorID = s.FloorLineId,
                              Floor = s.Floor,
                              Line = s.Line,
                              Division = s.Devision,
                              Status = s.Status
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueProductionFloor(string floor, string line, Nullable<int> productionFloorID = null)
        {
            IQueryable<int> result;

            if (productionFloorID == null)
            {
                result = from s in unitOfWork.ProductionFloorRepository.Get()
                         where s.Floor == floor && s.Line == line
                         select s.FloorLineId;
            }
            else
            {
                result = from s in unitOfWork.ProductionFloorRepository.Get()
                         where s.Floor == floor && s.Line == line && s.FloorLineId != productionFloorID
                         select s.FloorLineId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
