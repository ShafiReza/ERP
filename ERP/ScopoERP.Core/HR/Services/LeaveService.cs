using AutoMapper;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Mapper;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;
using static System.Data.Entity.Infrastructure.Design.Executor;

namespace ScopoERP.Core.HR.Services
{
    public class LeaveService
    {
        private UnitOfWork unitOfWork;
        private HRContext hrContext;
        private IMapper mapper;

        public LeaveService(UnitOfWork _unitOfWork, HRContext hrContext)
        {
            unitOfWork = _unitOfWork;
            this.hrContext = hrContext;
            mapper = MapperConfigure.Initialize();
        }

        public List<LeaveApplicationViewModel> GetAllLeaveApplication(int? employeeId = null)
        {
            var data = (from l in hrContext.LeaveApplications
                        join e in hrContext.Employees on l.EmployeeID equals e.EmployeeID
                        join le in hrContext.LeaveTypes on l.LeaveTypeID equals le.LeaveTypeID
                        select new LeaveApplicationViewModel
                        {
                            ApplicationDate = l.ApplicationDate,
                            EmployeeID = l.EmployeeID,
                            EmployeeName = e.EmployeeName,
                            EmployeeCardNo = e.CardNo,
                            FromDate = l.FromDate,
                            ToDate = l.ToDate,
                            LeaveApplicationID = l.LeaveApplicationID,
                            LeaveTypeID = l.LeaveTypeID,
                            LeaveTypeName = le.LeaveTypeName,
                            ReasonOfLeave = l.ReasonOfLeave,
                            Status = l.Status,
                        }).AsQueryable();
            if(employeeId!=null)
                data = data.Where(x=>x.EmployeeID==employeeId);

            return data.OrderByDescending(x=>x.LeaveApplicationID).Take(20).ToList();
        }

        public void CreateLeaveApplication(LeaveApplicationViewModel leaveApplicationVM)
        {

            var leaveApplication = mapper.Map<LeaveApplication>(leaveApplicationVM);

            hrContext.LeaveApplications.Add(leaveApplication);
            hrContext.SaveChanges();
        }

        public void UpdateLeaveApplication(LeaveApplicationViewModel leaveApplicationVM)
        {


            var entity = hrContext.LeaveApplications.Find(leaveApplicationVM.LeaveApplicationID);
            if (entity != null)
            {

                entity.LeaveTypeID = leaveApplicationVM.LeaveTypeID;
                entity.ApplicationDate = leaveApplicationVM.ApplicationDate;
                entity.EmployeeID = leaveApplicationVM.EmployeeID;
                entity.FromDate = leaveApplicationVM.FromDate;
                entity.ToDate = leaveApplicationVM.ToDate;
                entity.ApproavedBy = leaveApplicationVM.ApproavedBy;
                entity.ApprovalDate = leaveApplicationVM.ApprovalDate;
                entity.ReasonOfLeave = leaveApplicationVM.ReasonOfLeave;
                entity.Status = leaveApplicationVM.Status;


                hrContext.Entry(entity).State = EntityState.Modified;


                hrContext.SaveChanges();
            }
        }

        public List<LeaveBalanceViewModel> GetLeaveBalance(string cardNo)
        {
            string query = $"EXEC ScopoHR..GetLeaveBalance '{cardNo}'";

            var data = unitOfWork.UserRepository.SelectQuery<LeaveBalanceViewModel>(query);

            return data;
        }
    }
}
