using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.ProductionStatus.ViewModel;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace ScopoERP.ProductionStatus.BLL
{
    public class StandardOperationLogic
    {
        private UnitOfWork unitOfWork;
        private Operations operation;

        public StandardOperationLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public StandardOperationViewModel SaveStandardOperation(StandardOperationViewModel stdOperationVM)
        {
            if (stdOperationVM.OperationID != 0)
            {
                operation = new Operations
                {
                    OperationID = stdOperationVM.OperationID,
                    OperationName = stdOperationVM.OperationName,
                    OperationCodeNo = stdOperationVM.OperationCodeNo,
                    OperationCategoryID = stdOperationVM.OperationCategoryID,
                    JobClassID = stdOperationVM.JobClassID,
                    MachineID= stdOperationVM.MachineID,
                    Sam = stdOperationVM.Sam,
                };
                unitOfWork.StandardOperationRepository.Update(operation);
                unitOfWork.Save();
                return stdOperationVM;
            }
            else
            {
                operation = new Operations
                {
                    OperationName = stdOperationVM.OperationName,
                    OperationCodeNo = stdOperationVM.OperationCodeNo,
                    OperationCategoryID = stdOperationVM.OperationCategoryID,
                    JobClassID = stdOperationVM.JobClassID,
                    MachineID = stdOperationVM.MachineID,
                    Sam = stdOperationVM.Sam,
                };
                unitOfWork.StandardOperationRepository.Insert(operation);
                unitOfWork.Save();
                return GetStandardOperationByID(operation.OperationID);
            }
        }

        public void DeleteStandardOperationByID(int id)
        {
            unitOfWork.StandardOperationRepository.Delete(unitOfWork.StandardOperationRepository.GetById(id));
            unitOfWork.Save();
        }

        public List<StandardOperationViewModel> GetAllStandardOperations(int? operationId, int? operationCategoryId, int? jobClassId)
        {
            var result = (from st in unitOfWork.StandardOperationRepository.Get()
                          join j in unitOfWork.JobClassRepository.Get() on st.JobClassID equals j.JobClassID
                          join o in unitOfWork.OperationCategoryRepository.Get() on st.OperationCategoryID equals o.OperationCategoryID
                          select new StandardOperationViewModel
                          {
                              OperationID = st.OperationID,
                              OperationName = st.OperationName,
                              OperationCodeNo = st.OperationCodeNo,
                              OperationCategoryID = st.OperationCategoryID,
                              OperationCategoryName = o.OperationCategoryName,
                              JobClassID = st.JobClassID,
                              JobClassName = j.JobClassName,
                              Sam = st.Sam,
                              MachineID= st.MachineID,
                          }).AsQueryable();
            if(operationId != null)
                result = result.Where(x=>x.OperationID== operationId);
            if (jobClassId != null)
                result = result.Where(x => x.JobClassID == jobClassId);
            if (operationCategoryId != null)
                result = result.Where(x => x.OperationCategoryID == operationCategoryId);
            return result.OrderBy(x=>x.OperationCodeNo).Take(20).ToList();

        }

        public StandardOperationViewModel GetStandardOperationByID(int id)
        {
            operation = unitOfWork.StandardOperationRepository.GetById(id);
            return new StandardOperationViewModel
            {
                OperationID = operation.OperationID,
                OperationName = operation.OperationName,
                OperationCodeNo = operation.OperationCodeNo,
                OperationCategoryID = operation.OperationCategoryID
            };
        }

        public bool IsUniqueOperation(StandardOperationViewModel standardOperationVM)
        {
            IQueryable<int> result;

            if (standardOperationVM.OperationID == 0)
            {
                result = (from st in unitOfWork.StandardOperationRepository.Get()
                          where st.OperationName.ToLower().Trim() == standardOperationVM.OperationName.Trim().ToLower() && st.OperationCategoryID == standardOperationVM.OperationCategoryID
                          && st.OperationCodeNo.ToLower().Trim() == standardOperationVM.OperationCodeNo.Trim().ToLower()
                          select st.OperationID);
                //result = (IQueryable<int>)unitOfWork.StandardOperationRepository.Get().Where(x => x.OperationCodeNo.ToLower().Trim() == standardOperationVM.OperationCodeNo.Trim().ToLower() && x.OperationName.ToLower().Trim() == standardOperationVM.OperationName.Trim().ToLower()).ToList();

            }
            else
            {
                result = (from st in unitOfWork.StandardOperationRepository.Get()
                          where st.OperationName.ToLower().Trim() == standardOperationVM.OperationName.ToLower().Trim() && st.OperationID != standardOperationVM.OperationID
                          && st.OperationCodeNo.ToLower().Trim() == standardOperationVM.OperationCodeNo.Trim().ToLower()
                          && st.OperationCategoryID == standardOperationVM.OperationCategoryID
                          select st.OperationID);
            }

            return result.Count() == 0;
        }
    }
}
