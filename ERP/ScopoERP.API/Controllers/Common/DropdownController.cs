using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;
using ScopoERP.API.Models;
using ScopoERP.Common.ViewModel;
using ScopoERP.Core.API;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ScopoERP.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/Dropdown")]
    public class DropdownController : ApiController
    {
        private DropdownService dropdownService;
       
        public DropdownController(DropdownService _dropdownService)
        {
            this.dropdownService = _dropdownService;
        }

        [Route("GetBuyerDropDown")]
        [HttpGet]
        public IHttpActionResult GetBuyerDropDown()
        {
            var data = dropdownService.GetBuyerDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBankForwardingDropDown")]
        [HttpGet]
        public IHttpActionResult GetBankForwardingDropDown()
        {
            var data = dropdownService.GetBankForwardingDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetCompanyDropDown")]
        [HttpGet]
        public IHttpActionResult GetCompanyDropDown()
        {
            var data = dropdownService.GetCompanyDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetCustomerDropDown")]
        [HttpGet]
        public IHttpActionResult GetCustomerDropDown()
        {
            var data = dropdownService.GetCustomerDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetDepartmentDropDown")]
        [HttpGet]
        public IHttpActionResult GetDepartmentDropDown()
        {
            var data = dropdownService.GetDepartmentDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetHrDepartmentDropDown")]
        [HttpGet]
        public IHttpActionResult GetHrDepartmentDropDown()
        {
            var data = dropdownService.GetHrDepartmentDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetDesignationDropDown")]
        [HttpGet]
        public IHttpActionResult GetDesignationDropDown()
        {
            var data = dropdownService.GetDesignationDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetSectionDropDown")]
        [HttpGet]
        public IHttpActionResult GetSectionDropDown()
        {
            var data = dropdownService.GetSectionDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetSpecDropDown")]
        [HttpGet]
        public IHttpActionResult GetSpecDropDown()
        {
            var data = dropdownService.GetSpecDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetProductionUnitDropDown")]
        [HttpGet]
        public IHttpActionResult GetProductionUnitDropDown()
        {
            var data = dropdownService.GetProductionUnitDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetDivisionDropDown")]
        [HttpGet]
        public IHttpActionResult GetDivisionDropDown()
        {
            var data = dropdownService.GetDivisionDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetFactoryDropDown")]
        [HttpGet]
        public IHttpActionResult GetFactoryDropDown()
        {
            var data = dropdownService.GetFactoryDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetSeasonDropDown")]
        [HttpGet]
        public IHttpActionResult GetSeasonDropDown()
        {
            var data = dropdownService.GetSeasonDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetSupplierDropDown")]
        [HttpGet]
        public IHttpActionResult GetSupplierDropDown()
        {
            var data = dropdownService.GetSupplierDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBackToBackLCDropDown")]
        [HttpGet]
        public IHttpActionResult GetBackToBackLCDropDown(string searchCriteria)
        {
            var data = dropdownService.GetAllBackToBackLCDropDown(searchCriteria);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetFDBPDropDown")]
        [HttpGet]
        public IHttpActionResult GetFDBPDropDown()
        {
            var data = dropdownService.GetFDBPDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBankDropDown")]
        [HttpGet]
        public IHttpActionResult GetBankDropDown()
        {
            var data = dropdownService.GetBankDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetImportInvoiceDropDown")]
        [HttpGet]
        public IHttpActionResult GetImportInvoiceDropDown()
        {
            var data = dropdownService.GetInvoiceFromBL();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetExportInvoiceDropDown")]
        [HttpGet]
        public IHttpActionResult GetExportInvoiceDropDown(string searchCriteria)
        {
            var data = dropdownService.GetExportInvoice(searchCriteria);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetContractDropDown")]
        [HttpGet]
        public IHttpActionResult GetContractDropDown()
        {
            var data = dropdownService.GetContractDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetJobDropDown")]
        [HttpGet]
        public IHttpActionResult GetJobDropDown()
        {
            var data = dropdownService.GetJobDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetRequisitionDropDown")]
        [HttpGet]
        public IHttpActionResult GetRequisitionDropDown()
        {
            var data = dropdownService.GetRequisitionDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetAccountDropDown")]
        [HttpGet]
        public IHttpActionResult GetAccountDropDown()
        {
            var data = dropdownService.GetAccountDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetCostCenterDropDown")]
        [HttpGet]
        public IHttpActionResult GetCostCenterDropDown()
        {
            var data = dropdownService.GetCostCenterDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetVoucherTypeDropDown")]
        [HttpGet]
        public IHttpActionResult GetVoucherTypeDropDown()
        {
            var data = dropdownService.GetVoucherTypeDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetItemCategoryDropDown")]
        [HttpGet]
        public IHttpActionResult GetItemCategoryDropDown()
        {
            var data = dropdownService.GetItemCategoryDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetItemDropDown")]
        [HttpGet]
        public IHttpActionResult GetItemDropDown()
        {
            var data = dropdownService.GetItemDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetUnitDropDown")]
        [HttpGet]
        public IHttpActionResult GetUnitDropDown()
        {
            var data = dropdownService.GetUnitDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetPIDropDown")]
        [HttpGet]
        public IHttpActionResult GetPIDropDown()
        {
            var data = dropdownService.GetPIDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBLDropDown")]
        [HttpGet]
        public IHttpActionResult GetBLDropDown()
        {
            var data = dropdownService.GetBLDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetPurchaseOrderDropDown")]
        [HttpGet]
        public IHttpActionResult GetPurchaseOrderDropDown(string searchCriteria)
        {
            var data = dropdownService.GetPurchaseOrderDropDown(searchCriteria);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetEmployeeWithCardNoDropDown")]
        [HttpGet]
        public IHttpActionResult GetEmployeeWithCardNoDropDown(string searchCriteria)
        {
            var data = dropdownService.GetEmployeeWithCardNoDropDown(searchCriteria);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBankAccountsDropDown")]
        [HttpGet]
        public IHttpActionResult GetBankAccountsDropDown(string searchCriteria)
        {
            var data = dropdownService.GetBankAccountsDropDown(searchCriteria);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetStyleDropDown")]
        [HttpGet]
        public IHttpActionResult GetStyleDropDown(string searchCriteria)
        {
            var data = dropdownService.GetStyleDropDown(searchCriteria);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetLineDropDown")]
        [HttpGet]
        public IHttpActionResult GetLineDropDown(string floor)
        {
            var data = dropdownService.GetLineDropDown(floor);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetItemByPoDropDown")]
        [HttpGet]
        public IHttpActionResult GetItemByPoDropDown(int? poId = null)
        {
            var data = dropdownService.GetItemByPoDropDown(poId);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetPaymentTypeDropDown")]
        [HttpGet]
        public IHttpActionResult GetPaymentTypeDropDown()
        {
            var data = dropdownService.GetPaymentTypeDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetFloorDropDown")]
        [HttpGet]
        public IHttpActionResult GetFloorDropDown()
        {
            var data = dropdownService.GetFloorDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetFloorDropDownFromHR")]
        [HttpGet]
        public IHttpActionResult GetFloorDropDownFromHR()
        {
            var data = dropdownService.GetFloorDropDownFromHR();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetOperationCategoryDropDown")]
        [HttpGet]
        public IHttpActionResult GetOperationCategoryDropDown()
        {
            var data = dropdownService.GetOperationCategoryDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetOperationDropDown")]
        [HttpGet]
        public IHttpActionResult GetOperationDropDown()
        {
            var data = dropdownService.GetOperationDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetJobClassDropDown")]
        [HttpGet]
        public IHttpActionResult GetJobClassDropDown()
        {
            var data = dropdownService.GetJobClassDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetMachineCategoryDropDown")]
        [HttpGet]
        public IHttpActionResult GetMachineCategoryDropDown()
        {
            var data = dropdownService.GetMachineCategoryDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetAccountTypeDropDown")]
        [HttpGet]
        public IHttpActionResult GetAccountTypeDropDown()
        {
            var data = dropdownService.GetAccountTypeDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetParentAccountDropDown")]
        [HttpGet]
        public IHttpActionResult GetParentAccountDropDown()
        {
            var data = dropdownService.GetParentAccountDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }
                
        [Route("GetRoleDropDown")]
        [HttpGet]
        public IHttpActionResult GetRoleDropDown()
        {
            var RoleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new ApplicationDbContext()));

            var data = RoleManager.Roles.Select(x => new DropDownListViewModel { label = x.Name, ValueString = x.Name }).ToList();

            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetPortDropDown")]
        [HttpGet]
        public IHttpActionResult GetPortDropDown()
        {
            var data = dropdownService.GetPortDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetEmployeeDropDown")]
        [HttpGet]
        public IHttpActionResult GetEmployeeDropDown()
        {
            var data = dropdownService.GetEmployeeDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetCuttingPlanDropDown")]
        [HttpGet]
        public IHttpActionResult GetCuttingPlanDropDown(int purchaseOrderId)
        {
            var data = dropdownService.GetCuttingPlanDropDown(purchaseOrderId);
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetLeaveTypeDropdown")]
        [HttpGet]
        public IHttpActionResult GetLeaveTypeDropdown()
        {
            var data = dropdownService.GetLeaveTypeDropdown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetBranchDropdown")]
        [HttpGet]
        public IHttpActionResult GetBranchDropdown()
        {
            var data = dropdownService.GetBranchDropdown();
            if (data == null) return NotFound();

            return Ok(data);
        }

        [Route("GetShiftDropDown")]
        [HttpGet]
        public IHttpActionResult GetShiftDropDown()
        {
            var data = dropdownService.GetShiftDropDown();
            if (data == null) return NotFound();

            return Ok(data);
        }
    }
}
