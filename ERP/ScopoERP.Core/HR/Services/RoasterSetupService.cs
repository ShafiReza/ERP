using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.HR.Services
{
    public class RoasterSetupService
    {
        private UnitOfWork unitOfWOrk;
        private HRContext hrContext;
        public RoasterSetupService(UnitOfWork _unitOfWork, HRContext _hrContext)
        {
            this.unitOfWOrk = _unitOfWork;
            this.hrContext = _hrContext;
        }

        public void RoasterSetup(RoasterSetupViewModel roasterSetupVM)
        {
            var query = $"EXEC ScopoHR..RoasterSetup '" + roasterSetupVM.FromDate + "','" + roasterSetupVM.ToDate + "','" + roasterSetupVM.CardNo + "','" + roasterSetupVM.ShiftId + "'";

            unitOfWOrk.UserRepository.RawQuery(query);
        }

        public List<RoasterSetupViewModel> GetRoaserList(DateTime FromDate, DateTime ToDate, string CardNo)
        {
            var data = (from r in hrContext.SecurityGuardRosters
                        join e in hrContext.Employees on r.EmployeeId equals e.EmployeeID
                        join w in hrContext.WorkingShifts on r.ShiftId equals w.Id.ToString()
                        where r.WorkingDate >= FromDate && r.WorkingDate <= ToDate
                        && e.CardNo == CardNo
                        select new RoasterSetupViewModel
                        {
                            RoasterId = r.Id,
                            CardNo = CardNo,
                            EmployeeName = e.EmployeeName,
                            WorkingDate = r.WorkingDate,
                            ShiftName = w.Name
                        }).ToList();
            return data;
        }

        public string DeleteRoaster(int? id)
        {
            unitOfWOrk.UserRepository
                  .RawQuery($"DELETE FROM ScopoHR..SecurityGuardRosters WHERE Id = '{id}'");

            return "Delete Successfull";
        }


    }
}
