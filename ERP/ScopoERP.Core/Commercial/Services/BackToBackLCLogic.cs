using ScopoERP.Commercial.ViewModel;
using ScopoERP.Common.ViewModel;
using ScopoERP.Core.Commercial.ViewModels;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Commercial.BLL
{
    public class BackToBackLCLogic
    {
        private UnitOfWork unitOfWork;
        private backtobacklc backtobacklc;
        private piinfo piInfo;

        public BackToBackLCLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<BackToBackLCViewModel> GetAllBackToBackLC(int pageIndex, int pageSize, bool excelExport,
            int? jobId = null, int? b2bLCId = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            var query = (from b in unitOfWork.BackToBackLCRepository.Get()
                         join j in unitOfWork.JobRepository.Get() on b.JobID equals j.JobInfoId
                         orderby b.BackToBackLCID descending
                         select new { b, j }).AsQueryable();

            if (jobId != null)
                query = query.Where(x => x.b.JobID == jobId);

            if (b2bLCId != null)
                query = query.Where(x => x.b.BackToBackLCID == b2bLCId);

            if (fromDate != null && toDate != null)
                query = query.Where(x => x.b.BackToBackLCDate >= fromDate && x.b.BackToBackLCDate <= toDate);

            if (!excelExport)
                query = query.Skip((pageIndex - 1) * pageSize).Take(pageSize);

            var data = (from x in query
                        select new BackToBackLCViewModel
                        {
                            BackToBackLCID = x.b.BackToBackLCID,
                            BackToBackLCNo = x.b.BackToBackLC1,
                            BackToBackLCDate = x.b.BackToBackLCDate,
                            SightDays = x.b.SightDays,
                            MaturityType = x.b.MaturityDateCalculation,
                            BackToBackShippedDate = x.b.BackToBackShippedDate,

                            JobID = x.b.JobID,
                            JobNo = x.j.JobNo,

                            Status = x.b.Status,
                            BackToBackLCValue = x.b.BackToBackLCValue,
                            LCTypeID = x.b.LCTypeID,

                            AmendmentNo = x.b.AmendmentNo,
                            AmendmentDate = x.b.AmendmentDate,
                            B2BLCPreviousValue = x.b.B2BLCPreviousValue,

                            ExpiryDate = x.b.ExpiryDate,
                            ShipmentTo = x.b.ShipmentTo,
                            ShipmentFrom = x.b.ShipmentFrom,
                            ShipMode = x.b.ShipMode,
                            Clause = x.b.Clause,
                            InsuranceCoverNoteNo = x.b.InsuranceCoverNoteNo,
                            InsuranceCoverNoteDate = x.b.InsuranceCoverNoteDate,
                            HSCode = x.b.HSCode,
                            CountryOfOrigin = x.b.CountryOfOrigin,
                            LCAFormNo = x.b.LCAFormNo,

                            MaturityDate = x.b.bl.Max(s => s.MaturityDate),
                            AcceptanceValue = x.b.bl.Sum(s => s.AcceptanceValue),
                            TotalPaymentValue = x.b.BackToBackLCPayments.Sum(s => s.PaymentValue),
                            LastPaymentDate = x.b.BackToBackLCPayments.Max(s => s.PaymentDate),
                        }).ToList();


            return data;
        }

        public BackToBackLCViewModel GetBackToBackLCByID(int? id)
        {
            var result = (from c in unitOfWork.BackToBackLCRepository.Get()
                          join j in unitOfWork.JobRepository.Get() on c.JobID equals j.JobInfoId
                          join lc in unitOfWork.LCTypeRepository.Get() on c.LCTypeID equals lc.PaymentTypeID into g
                          from l in g.DefaultIfEmpty()
                          where c.BackToBackLCID == id
                          select new BackToBackLCViewModel
                          {
                              BackToBackLCID = c.BackToBackLCID,
                              BackToBackLCNo = c.BackToBackLC1,
                              BackToBackLCDate = c.BackToBackLCDate,
                              BackToBackLCValue = c.BackToBackLCValue,
                              BackToBackShippedDate = c.BackToBackShippedDate,

                              JobID = c.JobID,
                              JobNo = j.JobNo,
                              HSCode = c.HSCode,
                              LCTypeID = c.LCTypeID,
                              LCTypeTitle = l.PaymentTitle,

                              SightDays = c.SightDays,
                              MaturityType = c.MaturityDateCalculation,
                              EFD = c.EFD ?? false,

                              Status = c.Status,

                              AmendmentNo = c.AmendmentNo,
                              AmendmentDate = c.AmendmentDate,

                              ShipMode = c.ShipMode,
                              ShipmentTo = c.ShipmentTo,
                              ShipmentFrom = c.ShipmentFrom,
                              InsuranceCoverNoteNo = c.InsuranceCoverNoteNo,
                              InsuranceCoverNoteDate = c.InsuranceCoverNoteDate,
                              CountryOfOrigin = c.CountryOfOrigin,
                              Clause = c.Clause,
                              ExpiryDate = c.ExpiryDate,


                          }).SingleOrDefault();

            var piList = (from p in unitOfWork.PIRepository.Get()
                          join bc in unitOfWork.BackToBackLCRepository.Get() on p.BackToBackLCID equals bc.BackToBackLCID
                          join b in unitOfWork.BookingRepository.Get() on p.PIID equals b.PIId
                          where bc.BackToBackLCID == id
                          group b by new { p.PIID, p.PINo } into s
                          select new PISummary
                          {
                              PIID = s.Key.PIID,
                              PINo = s.Key.PINo,
                              PIValue = s.Sum(x => x.TotalQuantity * x.UnitPrice)
                          }).ToList();


            result.PIList = piList;

            return result;
        }

        public int CreateBackToBackLC(BackToBackLCViewModel backToBackLCVM)
        {
            this.backtobacklc = new backtobacklc()
            {
                BackToBackLC1 = backToBackLCVM.BackToBackLCNo,
                BackToBackLCDate = backToBackLCVM.BackToBackLCDate,
                BackToBackLCValue = backToBackLCVM.BackToBackLCValue,
                BackToBackShippedDate = backToBackLCVM.BackToBackShippedDate,

                JobID = backToBackLCVM.JobID,
                LCTypeID = backToBackLCVM.LCTypeID,
                SightDays = backToBackLCVM.SightDays,
                Status = true,
                EFD = backToBackLCVM.EFD,
                MaturityDateCalculation = backToBackLCVM.MaturityType,

                AmendmentNo = backToBackLCVM.AmendmentNo,
                AmendmentDate = backToBackLCVM.AmendmentDate,
                B2BLCPreviousValue = backToBackLCVM.B2BLCPreviousValue,
                ShipMode = backToBackLCVM.ShipMode,
                ShipmentFrom = backToBackLCVM.ShipmentFrom,
                ShipmentTo = backToBackLCVM.ShipmentTo,
                CountryOfOrigin = backToBackLCVM.CountryOfOrigin,
                LCAFormNo = backToBackLCVM.LCAFormNo,
                Clause = backToBackLCVM.Clause,
                ExpiryDate = backToBackLCVM.ExpiryDate,
                InsuranceCoverNoteDate = backToBackLCVM.InsuranceCoverNoteDate,
                InsuranceCoverNoteNo = backToBackLCVM.InsuranceCoverNoteNo,
                HSCode = backToBackLCVM.HSCode

            };

            unitOfWork.BackToBackLCRepository.Insert(backtobacklc);

            if (backToBackLCVM.PIList != null)
            {
                foreach (var item in backToBackLCVM.PIList)
                {
                    piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                    piInfo.BackToBackLCID = backToBackLCVM.BackToBackLCID;

                    unitOfWork.PIRepository.Update(piInfo);
                }

            }

            unitOfWork.Save();

            return backtobacklc.BackToBackLCID;
        }

        public void UpdateBackToBackLC(BackToBackLCViewModel backToBackLCVM)
        {
            this.backtobacklc = new backtobacklc()
            {
                BackToBackLCID = backToBackLCVM.BackToBackLCID,
                BackToBackLC1 = backToBackLCVM.BackToBackLCNo,
                BackToBackLCDate = backToBackLCVM.BackToBackLCDate,
                BackToBackLCValue = backToBackLCVM.BackToBackLCValue,
                BackToBackShippedDate = backToBackLCVM.BackToBackShippedDate,

                JobID = backToBackLCVM.JobID,
                LCTypeID = backToBackLCVM.LCTypeID,
                SightDays = backToBackLCVM.SightDays,
                Status = true,
                EFD = backToBackLCVM.EFD,
                MaturityDateCalculation = backToBackLCVM.MaturityType,

                AmendmentNo = backToBackLCVM.AmendmentNo,
                AmendmentDate = backToBackLCVM.AmendmentDate,
                B2BLCPreviousValue = backToBackLCVM.B2BLCPreviousValue,
                ShipMode = backToBackLCVM.ShipMode,
                ShipmentFrom = backToBackLCVM.ShipmentFrom,
                ShipmentTo = backToBackLCVM.ShipmentTo,
                CountryOfOrigin = backToBackLCVM.CountryOfOrigin,
                LCAFormNo = backToBackLCVM.LCAFormNo,
                Clause = backToBackLCVM.Clause,
                ExpiryDate = backToBackLCVM.ExpiryDate,
                InsuranceCoverNoteDate = backToBackLCVM.InsuranceCoverNoteDate,
                InsuranceCoverNoteNo = backToBackLCVM.InsuranceCoverNoteNo,
                HSCode = backToBackLCVM.HSCode
            };

            unitOfWork.BackToBackLCRepository.Update(backtobacklc);
              
            var piList = (from s in unitOfWork.PIRepository.Get()
                          where s.BackToBackLCID == backToBackLCVM.BackToBackLCID
                          select s).ToList();

            foreach (var item in piList)
            {
                piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                piInfo.BackToBackLCID = null;
                unitOfWork.PIRepository.Update(piInfo);
            }

            foreach (var item in backToBackLCVM.PIList)
            {
                piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                piInfo.BackToBackLCID = backToBackLCVM.BackToBackLCID;
                unitOfWork.PIRepository.Update(piInfo);
            }

            var existAmendment = unitOfWork.BackToBackLCRepository.Get()
                .Where(c => c.BackToBackLCID == backToBackLCVM.BackToBackLCID)
                .Select(s => s.AmendmentNo)
                .SingleOrDefault();

            if (backToBackLCVM.AmendmentNo != null && backToBackLCVM.AmendmentNo != existAmendment )
            {
                foreach (var blh in backToBackLCVM.PIList)
                {
                    var backtobacklchistory = new backtobacklchistory
                    {
                        BackToBackLCID = backToBackLCVM.BackToBackLCID,
                        PIID = blh.PIID,
                        PIValue = blh.PIValue,
                        AmendmentNo = backToBackLCVM.AmendmentNo,
                        AmendmentDate = backToBackLCVM.AmendmentDate
                    };
                    unitOfWork.BacktobacklchistoryRepository.Insert(backtobacklchistory);
                }
            }

            unitOfWork.Save();
        }

        private bool ReleasePIFromBackToBackLC(int lcID)
        {
            try
            {
                var expiList = (from s in unitOfWork.PIRepository.Get()
                                where s.BackToBackLCID == lcID
                                select s).ToList();

                foreach (var item in expiList)
                {
                    piInfo = unitOfWork.PIRepository.Get().SingleOrDefault(x => x.PIID == item.PIID);
                    piInfo.BackToBackLCID = null;
                    unitOfWork.PIRepository.Update(piInfo);
                }
                return true;
            }
            catch (Exception ex)
            {
                var z = ex;
                return false;
            }
        }

        public List<BackToBackLCHistoryViewModel> GetBackToBackLCHistory(int lcID)
        {
            var result = (from b in unitOfWork.BacktobacklchistoryRepository.Get()
                          where b.BackToBackLCID == lcID
                          select new BackToBackLCHistoryViewModel
                          {
                              BackToBackLCHistoryID = b.BackToBackLCID,
                              BackToBackLCID = b.BackToBackLCID,
                              PIID = b.PIID,
                              PIValue = b.PIValue,
                              AmendmentDate = b.AmendmentDate,
                              AmendmentNo = b.AmendmentNo,
                          }).ToList();
            return result;
        }

        public bool DeleteBackToBackLC(int lcID)
        {
            if (ReleasePIFromBackToBackLC(lcID))
            {
                backtobacklc = unitOfWork.BackToBackLCRepository.GetById(lcID);
                unitOfWork.BackToBackLCRepository.Delete(backtobacklc);
                unitOfWork.Save();
                return true;
            }
            return false;
        }

        public bool IsUniqueBackToBackLC(string backToBackLCNo)
        {
           

          
             var result = from s in unitOfWork.BackToBackLCRepository.Get()
                         where s.BackToBackLC1 == backToBackLCNo 
                         select s.BackToBackLCID;
            

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }

        public decimal GetPIValueByID(int piID)
        {
            decimal? fromBooking = (from c in unitOfWork.BookingRepository.Get()
                                    where c.PIId == piID
                                    group c by c.PIId into g
                                    select g.Sum(c => c.TotalQuantity * c.UnitPrice)).SingleOrDefault();

            decimal? fromExcessBooking = (from c in unitOfWork.ExcessBookingRepository.Get()
                                          where c.ProformaInvoiceID == piID
                                          group c by c.ProformaInvoiceID into g
                                          select g.Sum(x => x.TotalPrice)).SingleOrDefault();

            decimal result = fromBooking + fromExcessBooking ?? 0;

            return result;
        }
    }
}
