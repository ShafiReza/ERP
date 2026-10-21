using ScopoERP.Domain.Models;
using ScopoERP.OrderManagement.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static System.Data.Entity.Infrastructure.Design.Executor;
using System.Web.UI.WebControls;
using ScopoERP.Core.HR.Services;
using ScopoERP.API.Helper;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Domain.Models.HR;
using System.Drawing.Printing;
using Newtonsoft.Json;
using Swashbuckle.Swagger;
using System.Web.Http.Results;
using RestSharp;
using static ScopoERP.Core.HR.ViewModels.VoterViewModel;

namespace ScopoERP.API.Controllers.HR
{
    [Authorize]
    [RoutePrefix("api/Employees")]
    public class EmployeesController : ApiController
    {
        private EmployeeService employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            this.employeeService = employeeService;
        }

        [HttpGet]
        public IHttpActionResult Get(int pageIndex = 1, int pageSize = 10, string cardNo = null, int? departmentId = null, int? designationId = null, int? floorId = null, int? sectionId = null, int? employeeId = null)
        {
            var data = employeeService.GetAll(pageIndex, pageSize,cardNo, departmentId, designationId, floorId, sectionId, employeeId);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpGet]
        public IHttpActionResult GetById(int id)
        {
            return Ok();
        }

        [Route("GetEmployeeProfile")]
        [HttpGet]
        public IHttpActionResult GetEmployeeProfile(int? id = null, string cardNo = null)
        {
            if (String.IsNullOrEmpty(cardNo) && id == null) 
                return BadRequest("Please insert Employee Id or Card No");

            return Ok();
        }

        [Route("GetEmployeeSalary")]
        [HttpGet]
        public IHttpActionResult GetEmployeeSalary(int id)
        {
            var data = employeeService.GetMappingSalary(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [Route("EmployeeSalary")]
        [HttpPost]
        public IHttpActionResult Post(MappingSalaryListViewModel employeeSalaryVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            employeeService.SaveEmployeeSalary(employeeSalaryVM);
            return Ok(employeeSalaryVM);
        }

        [Route("Promotion")]
        [HttpPost]
        public IHttpActionResult Post(PromotionViewModel promotionVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            employeeService.SavePromotion(promotionVM);
            return Ok(promotionVM);
        }

        [Route("SalaryIncrement")]
        [HttpPost]
        public IHttpActionResult Post(SalaryIncrementViewModel salaryIncrementVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            employeeService.SaveSalaryIncrements(salaryIncrementVM, User.Identity.Name);
            return Ok(salaryIncrementVM);
        }

        [Route("SalaryIncrementHistory")]
        [HttpGet]
        public IHttpActionResult GetSalaryIncrementHistory(int employeeId)
        {
            var data = employeeService.GetEmployeeeSalaryIncrementDetailsById(employeeId);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [Route("ChangeEmployeeCardNo")]
        [HttpPost]
        public IHttpActionResult Post(ChangeCardNoViewModel changeCardNoVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            employeeService.ModifyCardNo(changeCardNoVM);
            return Ok(1);
        }


        [HttpPost]
        public IHttpActionResult Post(EmployeeViewModel employeeVM)
        {
            if (!ModelState.IsValid) return BadRequest();

            employeeService.CreateEmployee(employeeVM);
            return Ok(employeeVM);
        }

        [HttpPut]
        public IHttpActionResult Put(EmployeeViewModel employeeVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            employeeService.UpdateEmployee(employeeVM);
            return Ok(employeeVM);
        }

        [HttpDelete]
        public IHttpActionResult Delete(InactiveEmployeeViewModel inactiveEmployeeVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            employeeService.InactiveEmployee(inactiveEmployeeVM);
            return Ok(inactiveEmployeeVM);
        }

        [Route("EmployeeVarification")]
        [HttpGet]
        public IHttpActionResult GetVerification(string NID, DateTime? birthDate, string Decision)
        {
            try
            {
                if (Decision == "NID")
                {

                    var dateOfBirth = birthDate != null ? birthDate.Value.ToString("yyyy-MM-dd") : null;
                    var requestBody = JsonConvert.SerializeObject(new { nidNumber = NID, dateOfBirth = dateOfBirth, englishTranslation = true });

                    var client = new RestClient("https://api.porichoybd.com/api/v2/verifications/autofill");
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("x-api-key", "d9f7b76c-0427-4e98-979f-c6d208d0762e");
                    request.AddHeader("Content-Type", "application/json");
                    request.AddHeader("Cookie", "ARRAffinity=b58dc8fc3f9c69141cd880d92347f18710538e94822732709ed153e7278aad28; ARRAffinitySameSite=b58dc8fc3f9c69141cd880d92347f18710538e94822732709ed153e7278aad28");
                    request.AddParameter("application/json", requestBody, ParameterType.RequestBody);
                    IRestResponse response = client.Execute(request);
                    NIDMaster data = JsonConvert.DeserializeObject<NIDMaster>(response.Content);

                    return Ok(data);

                }
                else if (Decision == "BC")
                {

                    var dateOfBirth = birthDate != null ? birthDate.Value.ToString("yyyy-MM-dd") : null;
                    var requestBody = JsonConvert.SerializeObject(new { birth_registration_number = NID, person_dob = dateOfBirth });

                    var client = new RestClient("https://porichoy.azurewebsites.net/api/Kyc/verify-birth-registration");
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("x-api-key", "d9f7b76c-0427-4e98-979f-c6d208d0762e");
                    request.AddHeader("Content-Type", "application/json");
                    request.AddHeader("Cookie", "ARRAffinity=f1e1af3d24b47c5af17e1980581ee68246e4614b9f7c1e1d91836412565b48eb; ARRAffinitySameSite=f1e1af3d24b47c5af17e1980581ee68246e4614b9f7c1e1d91836412565b48eb");
                    request.AddParameter("application/json", requestBody, ParameterType.RequestBody);
                    IRestResponse response = client.Execute(request);
                    BRNMaster data = JsonConvert.DeserializeObject<BRNMaster>(response.Content);

                    return Ok(data);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
