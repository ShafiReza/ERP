using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.MaterialManagement.BLL
{
    public class ItemCategoryLogic
    {
        private UnitOfWork unitOfWork;
        private itemcategory itemCategory;

        public ItemCategoryLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateItemCategory(ItemCategoryViewModel itemCategoryVM,string user)
        {
            itemCategory = new itemcategory
            {
                Name = itemCategoryVM.Name,
                ParentCategoryId = itemCategoryVM.ParentCategoryID,
                ModifiedBy=user,
                LastModifiedDate=DateTime.Now
            };

            unitOfWork.ItemCategoryRepository.Insert(itemCategory);
            unitOfWork.Save();
        }

        public void UpdateItemCategory(ItemCategoryViewModel itemCategoryVM,string user)
        {
            itemCategory = new itemcategory
            {
                ItemCategoryId = itemCategoryVM.ItemCategoryID,
                Name = itemCategoryVM.Name,
                ParentCategoryId = itemCategoryVM.ParentCategoryID,
                ModifiedBy=user,
                LastModifiedDate=DateTime.Now
            };

            unitOfWork.ItemCategoryRepository.Update(itemCategory);
            unitOfWork.Save();
        }

        public List<ItemCategoryViewModel> GetAllItemCategory(int? itemCategoryId)
        {
            var result = (from s in unitOfWork.ItemCategoryRepository.Get()
                          join pc in unitOfWork.ItemCategoryRepository.Get() on s.ParentCategoryId equals pc.ItemCategoryId into pcg
                          from pc in pcg.DefaultIfEmpty()
                          orderby s.Name ascending
                          select new ItemCategoryViewModel
                          {
                              ItemCategoryID = s.ItemCategoryId,
                              Name = s.Name,
                              ParentCategoryID = s.ParentCategoryId,
                              ParentCategoryName = pc !=null ? pc.Name : "",
                              ModifiedBy =s.ModifiedBy,
                              LastModifiedDate=s.LastModifiedDate
                              
                          }).AsQueryable();
            if(itemCategoryId != null)
                result = result.Where(x=>x.ItemCategoryID== itemCategoryId);

            return result.Take(20).ToList();
        }

        public ItemCategoryViewModel GetItemCategoryByID(int id)
        {
            var result = (from s in unitOfWork.ItemCategoryRepository.Get()
                          where s.ItemCategoryId == id
                          select new ItemCategoryViewModel
                          {
                              ItemCategoryID = s.ItemCategoryId,
                              Name = s.Name,
                              ParentCategoryID = s.ParentCategoryId,
                              ModifiedBy = s.ModifiedBy,
                              LastModifiedDate = s.LastModifiedDate
                          }).SingleOrDefault();

            return result;
        }


        public bool IsUniqueItemCategory(string itemCategoryName, Nullable<int> itemCategoryID = null)
        {
            IQueryable<int> result;

            if (itemCategoryID == null)
            {
                result = from s in unitOfWork.ItemCategoryRepository.Get()
                         where s.Name == itemCategoryName
                         select s.ItemCategoryId;
            }
            else
            {
                result = from s in unitOfWork.ItemCategoryRepository.Get()
                         where s.Name == itemCategoryName & s.ItemCategoryId != itemCategoryID
                         select s.ItemCategoryId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
