using ScopoERP.Core.Store.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace ScopoERP.Core.Store.Services
{
    public class InventoryLogic
    {
        private UnitOfWork unitOfWork;

        public InventoryLogic(UnitOfWork _unitOfWork)
        {
            unitOfWork = _unitOfWork;
        }

        public List<InventoryStatusViewModel> Get(int? styleId = null, int? poId = null, int? piId = null, int? blId = null)
        {
            var query = $"EXEC InventoryStatusReport {styleId ?? 0}, {poId ?? 0}, {piId ?? 0 }, {blId ?? 0}";

            var data = unitOfWork.InventoryReceiveRepository.SelectQuery<InventoryStatusViewModel>(query);

            return data;
        }

        public List<StockReportViewModel> GetStockReport(DateTime fromDate, DateTime toDate, int? itemCategoryId)
        {
            var query = $"EXEC GetStockReport '" + fromDate + "','" + toDate + "', " + (itemCategoryId ?? 0);

            var data = unitOfWork.InventoryReceiveRepository.SelectQuery<StockReportViewModel>(query).ToList();

            return data;
        }
    }
}
