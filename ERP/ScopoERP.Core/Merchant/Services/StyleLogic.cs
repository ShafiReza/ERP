using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.OrderManagement.BLL
{
    public class StyleLogic
    {
        private UnitOfWork unitOfWork;

        public StyleLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateStyle(StyleViewModel styleVM)
        {
            var style = new styleinfo
            {
                StyleNo = styleVM.StyleNo,
                StyleDescription = styleVM.StyleDescription,
                Capacity = styleVM.Capacity,
                Sam = styleVM.SAM,
                ExpectedEfficiency = styleVM.ExpectedEfficiency,
                BodyStyle = styleVM.BodyStyle,
                Item = styleVM.Item,
                Febrication = styleVM.Febrication,
                BuyerId = styleVM.BuyerID,
                CustomerId = styleVM.CustomerID,
                DevisionId = styleVM.DivisionID,
                AccountId = styleVM.AccountID,
                HSCode = styleVM.HSCode,
                //Image=styleVM.Image
            };

            unitOfWork.StyleRepository.Insert(style);
            unitOfWork.Save();
        }

        public void UpdateStyle(StyleViewModel styleVM)
        {
            var style = new styleinfo
            {
                StyleId = styleVM.StyleID,
                StyleNo = styleVM.StyleNo,
                StyleDescription = styleVM.StyleDescription,
                Capacity = styleVM.Capacity,
                Sam = styleVM.SAM,
                ExpectedEfficiency = styleVM.ExpectedEfficiency,
                BodyStyle = styleVM.BodyStyle,
                Item = styleVM.Item,
                Febrication = styleVM.Febrication,
                BuyerId = styleVM.BuyerID,
                CustomerId = styleVM.CustomerID,
                DevisionId = styleVM.DivisionID,
                AccountId = styleVM.AccountID,
                HSCode = styleVM.HSCode,
                //Image = styleVM.Image
            };

            unitOfWork.StyleRepository.Update(style);
            unitOfWork.Save();
        }

        public List<StyleViewModel> GetAllStyle(int accountId, int? styleId = null, int? buyerId = null)
        {
            var query = (from s in unitOfWork.StyleRepository.Get()
                         join b in unitOfWork.BuyerRepository.Get() on s.BuyerId equals b.BuyerId
                         join c in unitOfWork.CustomerRepository.Get() on s.CustomerId equals c.CustomerId
                         join d in unitOfWork.DivisionRepository.Get() on s.DevisionId equals d.DevisionId
                         where s.AccountId == accountId
                         orderby s.StyleId descending
                         select new { s, b, c, d }).AsQueryable();

            if (styleId != null)
                query = query.Where(x => x.s.StyleId == styleId);

            if(buyerId != null)
                query = query.Where(x => x.b.BuyerId == buyerId);

            if (styleId == null && buyerId == null)
                query = query.Take(10);


            var data = (from x in query
                        select new StyleViewModel
                        {
                            StyleID = x.s.StyleId,
                            StyleNo = x.s.StyleNo,
                            StyleDescription = x.s.StyleDescription,
                            Capacity = x.s.Capacity,
                            SAM = x.s.Sam,
                            ExpectedEfficiency = x.s.ExpectedEfficiency,
                            BodyStyle = x.s.BodyStyle,
                            Item = x.s.Item,
                            Febrication = x.s.Febrication,

                            BuyerID = x.s.BuyerId,
                            BuyerName = x.b.BuyerName,

                            CustomerID = x.s.CustomerId,
                            CustomerName = x.c.CustomerName,
                            ModifiedBy = x.s.ModifiedBy,
                            DivisionID = x.s.DevisionId,
                            DivisionName = x.d.DevisionName,

                            AccountID = x.s.AccountId,

                            HSCode = x.s.HSCode,

                            //Image = s.Image
                        }).ToList();

            return data;
        }

        public StyleViewModel GetStyleByID(int id)
        {
            var result = (from s in unitOfWork.StyleRepository.Get()
                          where s.StyleId == id
                          select new StyleViewModel
                          {
                              StyleID = s.StyleId,
                              StyleNo = s.StyleNo,
                              StyleDescription = s.StyleDescription,
                              Capacity = s.Capacity,
                              SAM = s.Sam,
                              ExpectedEfficiency = s.ExpectedEfficiency,
                              BodyStyle = s.BodyStyle,
                              Item = s.Item,
                              Febrication = s.Febrication,
                              BuyerID = s.BuyerId,
                              CustomerID = s.CustomerId,
                              DivisionID = s.DevisionId,
                              AccountID = s.AccountId,
                              HSCode = s.HSCode,
                              //Image = s.Image
                          }).SingleOrDefault();

            return result;
        }
    }
}
