using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.MaterialManagement.BLL
{
    public class ItemLogic
    {
        private UnitOfWork unitOfWork;
        private item item;

        public ItemLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateItem(ItemViewModel itemVM,string user)
        {
            item = new item
            {
                ItemCode = itemVM.ItemCode.Trim(),
                ItemDescription = itemVM.ItemDescription.Trim(),
                ItemCategoryId = itemVM.ItemCategoryID,
                UnitId = itemVM.ItemID,
                UnitPrice = itemVM.UnitPrice,
                ModifiedBy=user,
                LastModifiedDate=DateTime.Now
            };

            unitOfWork.ItemRepository.Insert(item);
            unitOfWork.Save();
        }

        public void UpdateItem(ItemViewModel itemVM,string user)
        {
            item = new item
            {
                ItemId = itemVM.ItemID,
                ItemCode = itemVM.ItemCode.Trim(),
                ItemDescription = itemVM.ItemDescription.Trim(),
                ItemCategoryId = itemVM.ItemCategoryID,
                UnitId = itemVM.ItemID,
                UnitPrice = itemVM.UnitPrice,
                ModifiedBy = user,
                LastModifiedDate = DateTime.Now
            };

            unitOfWork.ItemRepository.Update(item);
            unitOfWork.Save();
        }

        public List<ItemViewModel> GetAllItem(string itemCode, int? categoryId = null, int? itemId = null)
        {
            var query = (from i in unitOfWork.ItemRepository.Get()
                          join it in unitOfWork.ItemCategoryRepository.Get() on i.ItemCategoryId equals it.ItemCategoryId
                          join u in unitOfWork.ConsumptionUnitRepository.Get() on i.UnitId equals u.ConsumptionUnitId into ug
                          from un in ug.DefaultIfEmpty()
                          select new { i, it, un }
                          ).AsQueryable();

            if (categoryId != null)
                query = query.Where(x => x.it.ItemCategoryId == categoryId);

            if (itemId != null)
                query = query.Where(x => x.i.ItemId == itemId);

            if (itemCode != null)
                query = query.Where(x => x.i.ItemCode == itemCode);

            if (categoryId == null && itemId == null)
                query = query.OrderByDescending(x => x.i.ItemId).Take(10);

            var result = (from s in query
                          orderby s.i.ItemId descending
                          select new ItemViewModel
                          {
                              ItemID = s.i.ItemId,
                              ItemCode = s.i.ItemCode,
                              ItemDescription = s.i.ItemDescription,
                              ItemCategoryID = s.i.ItemCategoryId,
                              ItemCategoryName = s.it.Name,
                              UnitId = s.i.UnitId,
                              UnitName = s.un.UnitName,
                              UnitPrice = s.i.UnitPrice,
                              ModifiedBy = s.i.ModifiedBy,
                              LastModifiedDate = s.i.LastModifiedDate
                          }).ToList();

            return result;
        }
        
        public ItemViewModel GetItemByID(int id)
        {
            var result = (from s in unitOfWork.ItemRepository.Get()
                          join it in unitOfWork.ItemCategoryRepository.Get() on s.ItemCategoryId equals it.ItemCategoryId
                          join u in unitOfWork.ConsumptionUnitRepository.Get() on s.UnitId equals u.ConsumptionUnitId into ug
                          from un in ug.DefaultIfEmpty()
                          where s.ItemId == id
                          select new ItemViewModel
                          {
                              ItemID = s.ItemId,
                              ItemCode = s.ItemCode,
                              ItemDescription = s.ItemDescription,
                              ItemCategoryID = s.ItemCategoryId,
                              ItemCategoryName = it.Name,
                              UnitId = s.UnitId,
                              UnitName = un.UnitName,
                              UnitPrice = s.UnitPrice,
                              ModifiedBy = s.ModifiedBy,
                              LastModifiedDate = s.LastModifiedDate
                          }).SingleOrDefault();

            return result;
        }

        public ItemViewModel GetItemByCode(string itemCode)
        {
            var result = (from s in unitOfWork.ItemRepository.Get()
                          join it in unitOfWork.ItemCategoryRepository.Get() on s.ItemCategoryId equals it.ItemCategoryId
                          join u in unitOfWork.ConsumptionUnitRepository.Get() on s.UnitId equals u.ConsumptionUnitId into ug
                          from un in ug.DefaultIfEmpty()
                          where s.ItemCode == itemCode
                          select new ItemViewModel
                          {
                              ItemID = s.ItemId,
                              ItemCode = s.ItemCode,
                              ItemDescription = s.ItemDescription,
                              ItemCategoryID = s.ItemCategoryId,
                              ItemCategoryName = it.Name,
                              UnitId = s.UnitId,
                              UnitName = un.UnitName,
                              UnitPrice = s.UnitPrice,
                              ModifiedBy = s.ModifiedBy,
                              LastModifiedDate = s.LastModifiedDate
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueItem(string itemCode, int? itemID = null)
        {
            var query = (from s in unitOfWork.ItemRepository.Get()
                         where s.ItemCode == itemCode && !String.IsNullOrEmpty(itemCode)
                         select s).AsQueryable();

            if (itemID != null)
                query = query.Where(x => x.ItemId != itemID);

            return query.Count() == 0;
        }
    }
}
