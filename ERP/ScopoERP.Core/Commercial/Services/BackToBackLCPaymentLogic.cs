using ScopoERP.Commercial.ViewModel;
using ScopoERP.Core.Commercial.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ScopoERP.Core.Commercial.Services
{
    public class BackToBackLCPaymentLogic
    {
        private UnitOfWork unitOfWork;
        private BackToBackLCPayment backtobacklcpayment;

        public BackToBackLCPaymentLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<BackToBackLCPaymentViewModel> GetAllBackToBackLCPayment(int? backtobacklcId = null)
        {
            var query = (from b in unitOfWork.BackToBackLCPaymentRepository.Get()
                         join b2 in unitOfWork.BackToBackLCRepository.Get() on b.BackToBackLCID equals b2.BackToBackLCID
                         orderby b.BackToBackLCPaymentID descending
                         select new BackToBackLCPaymentViewModel
                         {
                             BackToBackLCPaymentID = b.BackToBackLCPaymentID,
                             BackToBackLCID = b.BackToBackLCID,
                             BackToBackLCNo = b2.BackToBackLC1,
                             BackToBackLCValue = b2.BackToBackLCValue,

                             PaymentValue = b.PaymentValue,
                             PaymentDate = b.PaymentDate,                   
                         }).AsQueryable();

            if (backtobacklcId != null)
                query = query.Where(x => x.BackToBackLCID == backtobacklcId);


            return query.Take(10).ToList();
        }

        public void CreateBackToBackLCPayment(BackToBackLCPaymentViewModel backTobackLcVM)
        {
            backtobacklcpayment = new BackToBackLCPayment
            {
                BackToBackLCID = backTobackLcVM.BackToBackLCID,
                PaymentValue = backTobackLcVM.PaymentValue,
                PaymentDate = backTobackLcVM.PaymentDate,
            };

            unitOfWork.BackToBackLCPaymentRepository.Insert(backtobacklcpayment);
            unitOfWork.Save();
        }

        public void UpdateBackToBackLCPayment(BackToBackLCPaymentViewModel backTobackLcVM)
        {
            backtobacklcpayment = new BackToBackLCPayment
            {
                BackToBackLCPaymentID = backTobackLcVM.BackToBackLCPaymentID,
                BackToBackLCID = backTobackLcVM.BackToBackLCID,
                PaymentValue = backTobackLcVM.PaymentValue,
                PaymentDate = backTobackLcVM.PaymentDate,
            };

            unitOfWork.BackToBackLCPaymentRepository.Update(backtobacklcpayment);
            unitOfWork.Save();
        }
    }
}
