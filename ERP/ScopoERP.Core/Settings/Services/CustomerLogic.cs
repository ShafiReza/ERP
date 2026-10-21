using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using ScopoERP.Stackholder.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ScopoERP.Stackholder.BLL
{
    public class CustomerLogic
    {
        private UnitOfWork unitOfWork;
        private customerinfo customer;

        public CustomerLogic(UnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void CreateCustomer(CustomerViewModel customerVM)
        {
            if (customerVM.CustomerID != 0)
            {
                UpdateCustomer(customerVM);
            }
            else
            {
                customer = new customerinfo
                {
                    CustomerName = customerVM.CustomerName
                };

                unitOfWork.CustomerRepository.Insert(customer);
                unitOfWork.Save();
            }

        }

        public void UpdateCustomer(CustomerViewModel customerVM)
        {
            customer = new customerinfo
            {
                CustomerId = customerVM.CustomerID,
                CustomerName = customerVM.CustomerName
            };

            unitOfWork.CustomerRepository.Update(customer);
            unitOfWork.Save();
        }

        public List<CustomerViewModel> GetAllCustomer()
        {
            var result = (from s in unitOfWork.CustomerRepository.Get()
                          orderby s.CustomerId descending
                          select new CustomerViewModel
                          {
                              CustomerID = s.CustomerId,
                              CustomerName = s.CustomerName
                          }).ToList();

            return result;
        }

        public CustomerViewModel GetCustomerByID(int id)
        {
            var result = (from s in unitOfWork.CustomerRepository.Get()
                          where s.CustomerId == id
                          select new CustomerViewModel
                          {
                              CustomerID = s.CustomerId,
                              CustomerName = s.CustomerName
                          }).SingleOrDefault();

            return result;
        }

        public bool IsUniqueCustomer(string customerName, Nullable<int> customerID = null)
        {
            IQueryable<int> result;

            if (customerID == null)
            {
                result = from s in unitOfWork.CustomerRepository.Get()
                         where s.CustomerName == customerName
                         select s.CustomerId;
            }
            else
            {
                result = from s in unitOfWork.CustomerRepository.Get()
                         where s.CustomerName == customerName & s.CustomerId != customerID
                         select s.CustomerId;
            }

            if (result.Count() > 0)
            {
                return false;
            }
            return true;
        }
    }
}
