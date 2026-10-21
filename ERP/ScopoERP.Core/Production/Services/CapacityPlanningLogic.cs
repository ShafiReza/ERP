using ScopoERP.Domain.Repositories;
using ScopoERP.ProductionStatus.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.ProductionStatus.BLL
{
    public class CapacityPlanningLogic
    {
        private UnitOfWork unitOfWork;
        public CapacityPlanningLogic(UnitOfWork _unitOfWork)
        {
            unitOfWork = _unitOfWork;

        }

        public List<CapacityPlanningViewModel> GetCapacityPlanning(DateTime fromDate, DateTime toDate, int factoryId)
        {
            var query = $"EXEC GetBuildup '" + fromDate + "','" + toDate + "', " + factoryId;
            var result = unitOfWork.ProductionStatusRepository.SelectQuery<CapacityPlanningViewModel>(query).ToList();

            return result;
        }
    }
}
