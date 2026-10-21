using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Finance.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Finance.BLL
{
    public class RealizationLogic
    {
        private UnitOfWork unitOfWork;
        private Realization realization;

        public RealizationLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<RealizationViewModel> GetAllRealization(int pageIndex, int pageSize, bool excelExport, int? bankforwardingId, DateTime? fromDate, DateTime? toDate)
        {
            var query = (from r in unitOfWork.RealizationRepository.Get()
                        join b in unitOfWork.BankForwardingRepository.Get() on r.BankForwardingID equals b.BankForwardingID
                        select new RealizationViewModel
                        {
                            RealizationID = r.RealizationID,
                            BankForwardingID = b.BankForwardingID,
                            BankForwardingNo = b.BankForwardingNo,
                            FDBPNo = b.FDBPNo,
                            RealizedValue = r.RealizedValue,
                            RealizationDate = r.RealizationDate,
                            CurrencyRate = r.CurrencyRate,
                            PrcValue = r.PrcValue,

                            LastModifiedDate = r.LastModifiedDate,
                            ModifiedBy = r.ModifiedBy,
                        }).AsQueryable();

            if(bankforwardingId!= null )
            {
                query = query.Where(x=>x.BankForwardingID==bankforwardingId);
            }

            if(fromDate != null && toDate!= null )
            {
                query = query.Where(x=>x.RealizationDate >= fromDate && x.RealizationDate <= toDate);
            }

            if (!excelExport)
                return query.OrderByDescending(o => o.RealizationID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();

            return query.OrderByDescending(x=>x.RealizationID).ToList();
        }

        public RealizationViewModel GetRealizationById(int id)
        {
            var data = (from r in unitOfWork.RealizationRepository.Get()
                        join b in unitOfWork.BankForwardingRepository.Get() on r.BankForwardingID equals b.BankForwardingID
                        where r.RealizationID == id
                        select new RealizationViewModel
                        {
                            RealizationID = r.RealizationID,
                            BankForwardingID = b.BankForwardingID,
                            BankForwardingNo = b.BankForwardingNo,
                            FDBPNo = b.FDBPNo,
                            RealizedValue = r.RealizedValue,
                            RealizationDate = r.RealizationDate,
                            CurrencyRate = r.CurrencyRate,
                            PrcValue = r.PrcValue,

                            LastModifiedDate = r.LastModifiedDate,
                            ModifiedBy = r.ModifiedBy,
                        }).SingleOrDefault();

            return data;
        }

        public void Create(RealizationViewModel vm)
        {
            realization = new Realization
            {
                BankForwardingID= vm.BankForwardingID,
                RealizedValue = vm.RealizedValue,
                RealizationDate = vm.RealizationDate,
                CurrencyRate = vm.CurrencyRate,
                PrcValue = vm.PrcValue,

                LastModifiedDate = vm.LastModifiedDate,
                ModifiedBy = vm.ModifiedBy,
            };

            unitOfWork.RealizationRepository.Insert(realization);
            unitOfWork.Save();
        }

        public void Update(RealizationViewModel vm)
        {
            realization = new Realization
            {
                RealizationID = vm.RealizationID,
                BankForwardingID = vm.BankForwardingID,
                RealizedValue = vm.RealizedValue,
                RealizationDate = vm.RealizationDate,
                CurrencyRate = vm.CurrencyRate,
                PrcValue = vm.PrcValue,

                LastModifiedDate = vm.LastModifiedDate,
                ModifiedBy = vm.ModifiedBy,
            };

            unitOfWork.RealizationRepository.Update(realization);
            unitOfWork.Save();
        }
    }
}
