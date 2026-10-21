using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.ProductionStatus.ViewModel;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.ProductionStatus.BLL
{
    public class JobClassLogic
    {
        private JobClasses jobClass;
        private UnitOfWork unitOfWork;

        public JobClassLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public List<JobClassViewModel> GetAllJobClassList()
        {
            return (from jc in unitOfWork.JobClassRepository.Get()
                    select new JobClassViewModel
                    {
                        JobClassID = jc.JobClassID,
                        JobClassName = jc.JobClassName,
                        BaseRate = jc.BaseRate,
                        MaxPaid = jc.MaxPaid
                    }

                ).ToList();
        }

        public bool IsUnique(JobClassViewModel jobClassVM)
        {
            IQueryable<int> result;

            if (jobClassVM.JobClassID == 0)
            {
                result = (from j in unitOfWork.JobClassRepository.Get()
                          where j.JobClassName.ToLower() == jobClassVM.JobClassName.ToLower()
                          select j.JobClassID);
            }
            else
            {
                result = (from j in unitOfWork.JobClassRepository.Get()
                          where j.JobClassName.ToLower().Trim() == jobClassVM.JobClassName.ToLower().Trim() && j.JobClassID != jobClassVM.JobClassID
                          select j.JobClassID);
            }

            return result.Count() == 0;
        }

        public void Update(JobClassViewModel jobClassVM)
        {
            jobClass = new JobClasses
            {
                JobClassID = jobClassVM.JobClassID,
                JobClassName = jobClassVM.JobClassName,
                BaseRate = jobClassVM.BaseRate,
                MaxPaid = jobClassVM.MaxPaid
            };
            unitOfWork.JobClassRepository.Update(jobClass);
            unitOfWork.Save();
        }

        public void Create(JobClassViewModel jobClassVM)
        {
            jobClass = new JobClasses
            {
                JobClassName = jobClassVM.JobClassName,
                BaseRate = jobClassVM.BaseRate,
                MaxPaid = jobClassVM.MaxPaid
            };
            unitOfWork.JobClassRepository.Insert(jobClass);
            unitOfWork.Save();
        }

        public JobClassViewModel GetJobClassDetailByID(int jobClassID)
        {
            return (from jc in unitOfWork.JobClassRepository.Get()
                    where jc.JobClassID == jobClassID
                    select new JobClassViewModel
                    {
                        JobClassID = jc.JobClassID,
                        JobClassName = jc.JobClassName,
                        BaseRate = jc.BaseRate,
                        MaxPaid = jc.MaxPaid
                    }

                ).SingleOrDefault();
        }

    }
}
