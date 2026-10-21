using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Stackholder.ViewModel;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Stackholder.BLL
{
    public class BuyerLogic
    {
        private UnitOfWork unitOfWork;
        private buyerinfo buyer;


        public BuyerLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

 
        public void CreateBuyer(BuyerViewModel buyerVM)
        {
            if (buyerVM.BuyerID != 0)
            {
               
                UpdateBuyer(buyerVM);
            }
            else
            {
                buyer = new buyerinfo
                {
                    BuyerName = buyerVM.BuyerName,
                    BuyerAddress= buyerVM.BuyerAddress,
                };
                buyer.IsActive = true;

                unitOfWork.BuyerRepository.Insert(buyer);
                unitOfWork.Save();
            }

        }

  
        public void UpdateBuyer(BuyerViewModel buyerVM)
        {
            buyer = new buyerinfo
            {
                BuyerId = buyerVM.BuyerID,
                BuyerName = buyerVM.BuyerName,
               BuyerAddress = buyerVM.BuyerAddress

            };
            buyer.IsActive = true;

            unitOfWork.BuyerRepository.Update(buyer);
            unitOfWork.Save();
        }


        public List<BuyerViewModel> GetAllBuyer()
        {
            var result = (from s in unitOfWork.BuyerRepository.Get()
                          where s.IsActive == true
                          orderby s.BuyerId descending
                          select new BuyerViewModel
                          {
                              BuyerID = s.BuyerId,
                              BuyerName = s.BuyerName, BuyerAddress = s.BuyerAddress,
                          }).ToList();

            return result;
        }


        public BuyerViewModel GetBuyerByID(int id)
        {
            var result = (from s in unitOfWork.BuyerRepository.Get()                      
                          where s.BuyerId == id
                          select new BuyerViewModel
                          {
                              BuyerID = s.BuyerId,
                              BuyerName = s.BuyerName,
                              BuyerAddress = s.BuyerAddress,
                          }).SingleOrDefault();

            return result;
        }


        public bool IsUniqueBuyer(string buyerName, int buyerID)
        {
            IQueryable<int> result;

            if (buyerID == 0)
            {
                result = from s in unitOfWork.BuyerRepository.Get()
                         where s.BuyerName == buyerName
                         select s.BuyerId;
            }
            else
            {
                result = from s in unitOfWork.BuyerRepository.Get()
                         where s.BuyerName == buyerName & s.BuyerId != buyerID
                         select s.BuyerId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
