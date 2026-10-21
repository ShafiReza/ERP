using ScopoERP.API.Common.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.MaterialManagement.ViewModel;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace ScopoERP.API.Common.Services
{

    public class SupportTicketLogic
    {
        private UnitOfWork unitOfWork;
        public SupportTicketLogic(UnitOfWork _unitOfWork)
        {
            this.unitOfWork = _unitOfWork;
        }

        public void CreateSupportTicket(SupportTicketViewModel supportTicketVM)
        {
            string referenceNo = "";
            var lastToken = unitOfWork.SupportTicketRepository.Get()
               .OrderByDescending(x => x.ID)
               .Select(x => x.TokenNo).FirstOrDefault();
          
            if (lastToken == null)
            {
                referenceNo = "TOKEN-" + DateTime.Now.Year.ToString() + "-00001";
            }
            else
            {
                string newReferenceNoInDigit = (Convert.ToInt32(lastToken.Split('-').Last()) + 1).ToString().PadLeft(5, '0');

                referenceNo = "TOKEN-" + DateTime.Now.Year.ToString() + "-" + newReferenceNoInDigit;
            }

            var supportTicketSystem = new SupportTicketSystems
            {
                TokenNo = referenceNo,
                CreatedDate = supportTicketVM.CreatedDate,
                CreatedBy = supportTicketVM.CreatedBy,
                Department = supportTicketVM.Department,
                IssueType = supportTicketVM.IssueType,
                Details = supportTicketVM.Details,
                AssignTo = supportTicketVM.AssignTo,
                DueDate = supportTicketVM.DueDate,
                CompletedDate = supportTicketVM.CompletedDate
            };
            unitOfWork.SupportTicketRepository.Insert(supportTicketSystem);
            unitOfWork.Save();
        }

        public void UpdateSupportTicket(SupportTicketViewModel supportTicketVm)
        {
            var supportTicket = unitOfWork.SupportTicketRepository.GetById(supportTicketVm.ID);

            supportTicket.Department = supportTicketVm.Department;
            supportTicket.IssueType = supportTicketVm.IssueType;
            supportTicket.Details = supportTicketVm.Details;
            supportTicket.AssignTo = supportTicketVm.AssignTo;
            supportTicket.DueDate = supportTicketVm.DueDate;
            supportTicket.CompletedDate = supportTicketVm.CompletedDate;
            
            unitOfWork.SupportTicketRepository.Update(supportTicket);
            unitOfWork.Save();
        }

        public List<SupportTicketViewModel> GetAllSupportTickets(DateTime fromDate, DateTime toDate, string assignTo)
        {
            var query = (from s in unitOfWork.SupportTicketRepository.Get()
                         orderby s.TokenNo descending
                         select new SupportTicketViewModel
                         {
                             ID = s.ID,
                             TokenNo = s.TokenNo,
                             CreatedBy = s.CreatedBy,
                             Department = s.Department,
                             Details = s.Details,
                             CreatedDate = s.CreatedDate,
                             IssueType = s.IssueType,
                             AssignTo = s.AssignTo,
                             DueDate = s.DueDate,
                             CompletedDate = s.CompletedDate
                         });

            query = query.Where(x => DbFunctions.TruncateTime(x.CreatedDate) >= fromDate
                & DbFunctions.TruncateTime(x.CreatedDate) <= toDate);
            query = query.Where(x => x.AssignTo == assignTo);            

            return query.ToList();
        }

    }
}
