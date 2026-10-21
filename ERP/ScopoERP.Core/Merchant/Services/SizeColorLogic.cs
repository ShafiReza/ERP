using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.OrderManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace ScopoERP.OrderManagement.BLL
{
    public class SizeColorLogic
    {
        private UnitOfWork unitOfWork;
        private sizecolor sizeColor;

        public SizeColorLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<SizeColorViewModel> GetSizeColor(int purchaseOrderID)
        {
            var result = (from s in unitOfWork.SizeColorRepository.Get()
                          where s.PoStyleId == purchaseOrderID
                          select new SizeColorViewModel
                          {

                              PurchaseOrderId = s.PoStyleId,
                              Color = s.Color,
                              Size = s.Size,
                              Quantity = s.Quantity,
                              FOB = s.FOB
                          }).ToList();

            return result;
        }

        public void SaveSizeColor(List<SizeColorViewModel> sizeColorList)
        {
            int purchaseOrderID = sizeColorList[0].PurchaseOrderId;

            var temp = (from s in unitOfWork.SizeColorRepository.Get()
                        where s.PoStyleId == purchaseOrderID
                        select s.SizeColorId).ToList();

            if (temp.Count != 0)
            {
                foreach (var sizeColorID in temp)
                {
                    unitOfWork.SizeColorRepository.Delete(new sizecolor { SizeColorId = sizeColorID });
                }
            }

            foreach (var item in sizeColorList)
            {
                sizeColor = new sizecolor
                {
                    PoStyleId = item.PurchaseOrderId,
                    Color = item.Color,
                    Size = item.Size,
                    Quantity = item.Quantity,
                    FOB = item.FOB
                };
                unitOfWork.SizeColorRepository.Insert(sizeColor);
            }
            unitOfWork.Save();
        }
    }
}
