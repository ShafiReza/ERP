using ScopoERP.Common.ViewModel;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace ScopoERP.Core.API
{
    public class DropdownService
    {
        private UnitOfWork unitOfWork;
        private HRContext hrContext;
            public DropdownService(UnitOfWork unitOfWork, HRContext hrContext)
        {
            this.unitOfWork = unitOfWork;
            this.hrContext = hrContext;
        }
        public List<DropDownListViewModel> GetBuyerDropDown()
        {
            var result = (from s in unitOfWork.BuyerRepository.Get()
                          select new DropDownListViewModel
                          {                            
                              value = s.BuyerId,                           
                              label=s.BuyerName
                          }).OrderBy(x => x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetBankForwardingDropDown()
        {
            var result = (from s in unitOfWork.BankForwardingRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.BankForwardingID,
                              label = s.BankForwardingNo
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetCompanyDropDown()
        {
            var result = (from s in unitOfWork.CompanyRepository.Get()
                          select new DropDownListViewModel
                          {                          
                              value = s.CompanyID,                         
                              label = s.CompanyName
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetCustomerDropDown()
        {
            var result = (from s in unitOfWork.CustomerRepository.Get()
                          select new DropDownListViewModel
                          {                           
                              value = s.CustomerId,                           
                              label = s.CustomerName
                          }).OrderBy(x => x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetSpecDropDown()
        {
            var result = new List<DropDownListViewModel>();

            return result;
        }
        public List<DropDownListViewModel> GetHrDepartmentDropDown()
        {
            var result = (from s in hrContext.Departments
                          select new DropDownListViewModel
                          {                            
                              value = s.DepartmentID,                                          
                              label = s.DepartmentName
                          }).OrderBy(x => x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetDepartmentDropDown()
        {
            var result = (from s in unitOfWork.DepartmentRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.DepartmentID,
                              label = s.DepartmentName
                          }).OrderBy(x => x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetDesignationDropDown()
        {
            var result = (from s in hrContext.Designations
                          select new DropDownListViewModel
                          {
                              value = s.DesignationID,
                              label = s.DesignationName
                          }).OrderBy(x => x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetSectionDropDown()
        {
            var result = (from s in hrContext.Sections
                          select new DropDownListViewModel
                          {
                              value = s.SectionID,
                              label = s.SectionName == s.Caption || s.Caption == null 
                                                            ? s.SectionName : s.SectionName + "-" + s.Caption,
                          }).OrderBy(x=>x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetProductionUnitDropDown()
        {
            var result = (from s in hrContext.ProductionFloorLines
                          select new DropDownListViewModel
                          {
                              value = s.ProductionFloorLineID,
                              label ="Floor: " + s.Floor + " -- Line: " + s.Line,
                              ValueString = s.Floor
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetDivisionDropDown()
        {
            var result = (from s in unitOfWork.DivisionRepository.Get()
                          select new DropDownListViewModel
                          {
                            
                              value = s.DevisionId,                            
                              label = s.DevisionName
                          }).ToList();


            return result;
        }
        public List<DropDownListViewModel> GetFactoryDropDown()
        {
            var result = (from s in unitOfWork.FactoryRepository.Get()
                          select new DropDownListViewModel
                          {                            
                              value = s.FactoryId,
                              label = s.FactoryName,
                          }).ToList();

            return result;
        }
        
        public List<DropDownListViewModel> GetSeasonDropDown()
        {
            var result = (from s in unitOfWork.SeasonRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.SeasonId,
                              label = s.SeasonName
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetSupplierDropDown()
        {
            var result = (from s in unitOfWork.SupplierRepository.Get()
                          orderby s.SupplierName
                          select new DropDownListViewModel
                          {
                              value = s.SupplierId,
                              label = s.SupplierName
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetUnitDropDown()
        {
            var result = (from s in unitOfWork.ConsumptionUnitRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.ConsumptionUnitId,
                              label = s.UnitName
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetAllBackToBackLCDropDown(string searchCriteria)
        {
            DateTime toDate = DateTime.Now;
            DateTime fromDate = toDate.AddDays(-360);

            var result = (from s in unitOfWork.BackToBackLCRepository.Get()
                          where s.BackToBackLC1.Contains(searchCriteria)
                          select new DropDownListViewModel
                          {
                              value = s.BackToBackLCID,
                              label = s.BackToBackLC1
                          }).Take(100).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetFDBPDropDown()
        {
            var result = (from s in unitOfWork.BankForwardingRepository.Get()
                          where !string.IsNullOrEmpty(s.FDBPNo)
                          select new DropDownListViewModel
                          {
                              value = s.BankForwardingID,
                              label = s.FDBPNo
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetBankDropDown()
        {
            var result = (from s in unitOfWork.BankRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.BankID,
                              label = s.BankName
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetInvoiceFromBL()
        {
            var result = (from b in unitOfWork.BLRepository.Get()
                          where b.IsChalan == false
                          select new DropDownListViewModel
                          {
                              value = b.BLID,
                              label = b.InvoiceNo
                          }).ToList();
            return result;
        }

        public List<DropDownListViewModel> GetExportInvoice(string searchCriteria)
        {
            var result = (from b in unitOfWork.ExportInvoiceRepository.Get()
                          where b.InvoiceNo.Contains(searchCriteria)
                          orderby b.InvoiceId descending
                          select new DropDownListViewModel
                          {
                              value = b.InvoiceId,
                              label = b.InvoiceNo
                          }).Take(100).ToList();
            return result;
        }

        public List<DropDownListViewModel> GetContractDropDown()
        {
            var result = (from s in unitOfWork.JobRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.JobInfoId,
                              label = s.ContractNo
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetJobDropDown(bool includeClosedJob = false)
        {
            var result = (from s in unitOfWork.JobRepository.Get()
                          where s.IsClosed == false || s.IsClosed == includeClosedJob
                          select new DropDownListViewModel
                          {
                              value = s.JobInfoId,
                              label = s.JobNo
                          }).AsEnumerable().OrderByDescending(x => x.label).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetPurchaseRequisitionDropDown()
        {
            List<DropDownListViewModel> result = (from s in unitOfWork.PurchaseRequisitionRepository.Get()
                                                  select new DropDownListViewModel
                                                  {
                                                      label = s.RequisitionNo,
                                                      value = s.PurchaseRequisitionID
                                                  }).Distinct().OrderByDescending(d => d.value).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetCostCenterDropDown()
        {
            var result = from c in unitOfWork.CostCenterRepository.Get()
                         where c.Status == true
                         select new DropDownListViewModel
                         {
                             value = c.CostCenterID,
                             label = c.CostCenterName
                         };
            return result.ToList();
        }

        public List<DropDownListViewModel> GetVoucherTypeDropDown()
        {
            var result = from c in unitOfWork.VoucherTypeRepository.Get()
                         select new DropDownListViewModel
                         {
                             value = c.VoucherTypeID,
                             label = c.VoucherTypeName
                         };
            return result.ToList();
        }

        public List<DropDownListViewModel> GetAccountDropDown()
        {
            var result = (from a in unitOfWork.SubsidiaryAccountRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = a.AccountID,
                              label = a.AccountNo + " " + a.AccountName
                          }).ToList();
            return result;
        }
        
        public List<DropDownListViewModel> GetItemCategoryDropDown()
        {
            var result = (from s in unitOfWork.ItemCategoryRepository.Get()
                          select new DropDownListViewModel
                          {                            
                              value = s.ItemCategoryId,
                              label = s.Name
                          }).OrderBy(x => x.label).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetItemDropDown()
        {
            var result = (from s in unitOfWork.ItemRepository.Get()
                          where s.ItemDescription != null
                          select new DropDownListViewModel
                          {
                              value = s.ItemId,
                              label = (!String.IsNullOrEmpty(s.ItemCode) ? s.ItemCode + " - " : "") + s.ItemDescription
                          }).OrderBy(x => x.label).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetPIDropDown()
        {
            var result = (from s in unitOfWork.PIRepository.Get()
                          join j in unitOfWork.JobRepository.Get() on s.JobID equals j.JobInfoId
                          where j.IsClosed == false
                          orderby s.PIID descending
                          select new DropDownListViewModel
                          {
                              value = s.PIID,
                              label = String.IsNullOrEmpty(s.PINo) ? s.ReferenceNo : s.PINo
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetBLDropDown()
        {
            var fromDate = DateTime.Now.AddDays(-120);

            var result = (from s in unitOfWork.BLRepository.Get()
                          where s.BLDate > fromDate
                          select new DropDownListViewModel
                          {
                              value = s.BLID,
                              label = s.BLNo
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetPurchaseOrderDropDown(string searchCriteria)
        {
            var result = (from s in unitOfWork.PurchaseOrderRepository.Get()
                          where s.PoNo.Contains(searchCriteria)
                          select new DropDownListViewModel
                          {
                              label = s.PoNo,
                              value = s.PoStyleId
                          }).Take(100).ToList();

            return result;
        }
        
        public List<DropDownListViewModel> GetRequisitionDropDown()
        {
            var result = (from s in unitOfWork.PurchaseRequisitionRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = s.PurchaseRequisitionID,
                              label = s.RequisitionNo
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetStyleDropDown(string searchCriteria)
        {
            var result = (from s in unitOfWork.StyleRepository.Get()
                          where s.StyleNo.Contains(searchCriteria)
                          select new DropDownListViewModel
                          {
                              label = s.StyleNo,
                              value = s.StyleId
                          }).Take(100).ToList();

            return result;
        }
        
        public List<DropDownListViewModel> GetMachineCategoryDropDown()
        {
            var result = new List<DropDownListViewModel>();

            return result;
        }

        public List<DropDownListViewModel> GetLineDropDown(string floor)
        {
            var result = (from c in unitOfWork.ProductionFloorRepository.Get()
                          where c.Status == 1 && c.Floor == floor
                          select new DropDownListViewModel
                          {
                              value=c.FloorLineId,
                              ValueString = c.Line,
                              label = c.Line
                          }).ToList();

            return result;
        }


        public List<DropDownListViewModel> GetItemByPoDropDown(int? poId)
        {
            if(poId == null) return new List<DropDownListViewModel>();

            var result = (from c in unitOfWork.InventoryReceiveRepository.Get()
                          join i in unitOfWork.ItemRepository.Get() on c.ItemID equals i.ItemId
                          where c.PurchaseOrderID == poId
                          select new DropDownListViewModel
                          {
                              value = c.ItemID,
                              ValueString = i.ItemDescription,
                              label = i.ItemDescription
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetPaymentTypeDropDown()
        {
            var result = (from c in unitOfWork.LCTypeRepository.Get()
                          select new DropDownListViewModel
                          {
                              value = c.PaymentTypeID,
                              label = c.PaymentTitle
                          }).ToList();

            return result;
        }
        public List<DropDownListViewModel> GetFloorDropDown()
        {
            var result = (from c in unitOfWork.ProductionFloorRepository.Get()
                          where c.Status == 1
                          select new DropDownListViewModel
                          {
                              label = c.Floor,
                              ValueString = c.Floor
                          }).Distinct().ToList();

            return result;
        }

        public List<DropDownListViewModel> GetFloorDropDownFromHR()
        {
            var result = (from c in hrContext.ProductionFloorLines
                          select new DropDownListViewModel
                          {
                              label = c.Floor,
                              ValueString = c.Floor
                          }).Distinct().ToList();

            return result;
        }
        public List<DropDownListViewModel> GetOperationDropDown()
        {
            var data = (from st in unitOfWork.StandardOperationRepository.Get()
                        select new DropDownListViewModel
                        {
                            label = st.OperationName,
                            value = st.OperationID,
                            ValueString = st.OperationCodeNo
                        }).OrderBy(x => x.label).ToList();
            return data;
        }

        public List<DropDownListViewModel> GetOperationCategoryDropDown()
        {
            var data = (from st in unitOfWork.OperationCategoryRepository.Get()
                        select new DropDownListViewModel
                        {
                            label = st.OperationCategoryName,
                            value = st.OperationCategoryID
                        }).OrderBy(x => x.label).ToList();
            return data;
        }

        public List<DropDownListViewModel> GetJobClassDropDown()
        {
            var data = (from st in unitOfWork.JobClassRepository.Get()
                        select new DropDownListViewModel
                        {
                            label = st.JobClassName,
                            value = st.JobClassID
                        }).OrderBy(x => x.label).ToList();
            return data;
        }

        public List<DropDownListViewModel> GetAccountTypeDropDown()
        {
            var result = from v in unitOfWork.AccSysAccountTypeRepository.Get()
                         select new DropDownListViewModel
                         {
                             value = v.AccountTypeID,
                             label = v.AccountTypeName,
                         };
            return result.ToList();
        }

        public List<DropDownListViewModel> GetParentAccountDropDown()
        {
            var result = (from s in unitOfWork.ParentAccountRepository.Get()                        
                          select new DropDownListViewModel
                          {
                              value = s.AccountID,
                              label = s.AccountNo +"-"+s.AccountName,                                                  

                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetShiftDropDown()
        {
            var result = (from s in hrContext.WorkingShifts
                          select new DropDownListViewModel
                          {
                              value = s.Id,
                              label = s.Name

                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetPortDropDown()
        {
            var result = new List<DropDownListViewModel>
            {
                new DropDownListViewModel { label = "Chittagong", ValueString = "Chittagong" },
                new DropDownListViewModel { label = "Benapole", ValueString = "Benapole" },
                new DropDownListViewModel { label = "Airport", ValueString = "Airport" },
                new DropDownListViewModel { label = "AEPZ", ValueString = "AEPZ" },
                new DropDownListViewModel { label = "CEPZ", ValueString = "CEPZ" },
                new DropDownListViewModel { label = "DEPZ", ValueString = "DEPZ" },
                new DropDownListViewModel { label = "KEPZ", ValueString = "KEPZ" }
            };

            return result;
        }

        public List<DropDownListViewModel> GetCuttingPlanDropDown(int purchaseOrderId) 
        {
            var result = new List<DropDownListViewModel>();
            return result;
        }

        public List<DropDownListViewModel> GetEmployeeDropDown()
        {
            var result = new List<DropDownListViewModel>();
            return result;

            return result;
        }

        public List<DropDownListViewModel> GetEmployeeWithCardNoDropDown(string searchCriteria)
        {
            var result = (from e in hrContext.Employees
                          where e.CardNo.Contains(searchCriteria)
                          select new DropDownListViewModel
                          {
                              label = e.EmployeeName+"("+e.CardNo+")",
                              value = e.EmployeeID,
                              ValueString = e.CardNo,
                          }).Take(100).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetBankAccountsDropDown(string searchCriteria)
        {
            var result = (from b in hrContext.BankSalaries
                          where b.AccountNo.Contains(searchCriteria)
                          select new DropDownListViewModel
                          {
                              label = b.AccountNo + "(" + b.CardNo + ")",
                              value = b.ID
                          }).Take(100).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetLeaveTypeDropdown()
        {
            var result = (from e in hrContext.LeaveTypes
                          select new DropDownListViewModel
                          {
                              label = e.LeaveTypeName,
                              value = e.LeaveTypeID
                          }).ToList();

            return result;
        }

        public List<DropDownListViewModel> GetBranchDropdown()
        {
            var result = (from e in hrContext.Branches
                          select new DropDownListViewModel
                          {
                              label = e.BranchName,
                              value = e.BranchID
                          }).ToList();

            return result;
        }
    }
}
