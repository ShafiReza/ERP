using AutoMapper;
using ScopoERP.Core.HR.ViewModels;
using ScopoERP.Core.Mapper;
using ScopoERP.Domain.Models;
using ScopoERP.Domain.Models.HR;
using ScopoERP.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Text;
using System.Threading.Tasks;
using static ScopoERP.Core.HR.ViewModels.VoterViewModel;

namespace ScopoERP.Core.HR.Services
{
    public class EmployeeService
    {
        private HRContext _context;
        private IMapper mapper;

        public EmployeeService(HRContext context)
        {
            this._context = context;
            mapper = MapperConfigure.Initialize();
        }
        public List<EmployeeViewModel> GetAll(int pageIndex, int pageSize, string cardNo = null, int? departmentId = null, int? designationId = null, int? floorId = null, int? sectionId = null, int? employeeId = null)
        {
           var data = (from e in _context.Employees
                       join d in _context.Departments on e.DepartmentID equals d.DepartmentID into dg
                       from d in dg.DefaultIfEmpty()
                       join de in _context.Designations on e.DesignationID equals de.DesignationID into deg
                       from de in deg.DefaultIfEmpty()
                       join s in _context.Sections on e.SectionID equals s.SectionID into sg
                       from s in sg.DefaultIfEmpty()
                       join p in _context.ProductionFloorLines on e.ProductionFloorLineID equals p.ProductionFloorLineID into pg
                       from p in pg.DefaultIfEmpty()
                       join b in _context.Branches on e.BranchID equals b.BranchID into bg
                       from b in bg.DefaultIfEmpty()
                       join w in _context.WorkingShifts on e.ShiftId equals w.Id into wg
                       from w in wg.DefaultIfEmpty()
                       where e.IsActive == true
                      select new EmployeeViewModel
                      {
                         EmployeeID = e.EmployeeID,
                         EmployeeName = e.EmployeeName,
                         EmployeeNameBN = e.EmployeeNameBN,
                         CardNo= e.CardNo,
                         DepartmentName = d != null ? d.DepartmentName : "",
                         DepartmentID= e.DepartmentID,
                         DesignationID= e.DesignationID,
                         DesignationName=de !=null ? de.DesignationName : "",
                         SectionID = e.SectionID,
                         SectionName = s != null ? s.SectionName : "",
                          ProductionFloorLineName = p != null ? p.Floor : "",
                          ProductionFloorLineID = e.ProductionFloorLineID,
                          BranchName= b != null ? b.BranchName : "",
                          BranchID= e.BranchID,
                         MobileNo = e.MobileNo,
                         EmergencyContactNo = e.EmergencyContactNo,
                         MFSNo= e.MFSNo,
                          ShiftName = w != null ? w.Name : "",
                          JoinDate= e.JoinDate,
                          ShiftId= e.ShiftId,
                          EmployeeType= e.EmployeeType,
                          GenderID= e.GenderID,
                          IsActive= e.IsActive,
                          OTApplicable= e.OTApplicable,
                          AttendanceBonusApplicable= e.AttendanceBonusApplicable,
                          MaritalStatus= e.MaritalStatus,
                          SpouseName= e.SpouseName,
                          SalaryGrade= e.SalaryGrade,
                      }).AsQueryable();
            if(departmentId!= null)
                data = data.Where(x=>x.DepartmentID == departmentId);
            if(sectionId!= null)
                data = data.Where(x=>x.SectionID== sectionId);
            if(floorId!= null)
                data = data.Where(x=> x.ProductionFloorLineID== floorId);
            if(designationId!= null)
                data = data.Where(x=>x.DesignationID== designationId);
            if (employeeId != null)
                data = data.Where(x => x.EmployeeID == employeeId);

            return data.OrderByDescending(o => o.EmployeeID).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
        }

        public void CreateEmployee(EmployeeViewModel employeeVM)
        {

            var employee = mapper.Map<Employee>(employeeVM);
            employee.IsActive= true;
            _context.Employees.Add(employee);
            _context.SaveChanges();
        }

        public void UpdateEmployee(EmployeeViewModel employeeVM)
        {
            //var entity = _context.Employees.Find(employeeVM.EmployeeID);
            var entity = mapper.Map<Employee>(employeeVM);
            
            if (entity != null)
            {
                _context.Employees.Attach(entity);
                _context.Entry(entity).State = EntityState.Modified;

                _context.SaveChanges();
            }
        }

        public void SaveEmployeeSalary(MappingSalaryListViewModel employeeSalaryVM)
        {

            var existingSalaryMapping = _context.SalaryMappings.Where(x=>x.EmployeeID == employeeSalaryVM.EmployeeID).ToList();

            if(existingSalaryMapping != null)
            {
                _context.SalaryMappings.RemoveRange(existingSalaryMapping);
            }

            var list = new List<SalaryMapping>();

            foreach(var item in employeeSalaryVM.SalaryList)
            {
                list.Add(new SalaryMapping
                {
                    Amount = (decimal)item.Amount,
                    EmployeeID = item.EmployeeID,
                    SalaryTypeID = item.SalaryTypeID
                });
            }
            _context.SalaryMappings.AddRange(list);
            _context.SaveChanges();
        }

        public List<MappingSalaryViewModel> GetMappingSalary( int employeeId)
        {
            var data = (from s in _context.SalaryTypes
                        join m in _context.SalaryMappings on s.SalaryTypeID equals m.SalaryTypeID
                        where m.EmployeeID == employeeId
                        select new MappingSalaryViewModel
                        {
                            EmployeeID =  m.EmployeeID,
                            SalaryTypeID = s.SalaryTypeID,
                            SalaryTypeName = s.SalaryTypeName,
                            Amount = m.Amount,
                            SalaryMappingID = m.SalaryMappingID,
                        }).ToList();

            if(data.Count == 0)
            {
                data = (from s in _context.SalaryTypes
                        select new MappingSalaryViewModel
                        {
                            SalaryTypeID = s.SalaryTypeID,
                            SalaryTypeName = s.SalaryTypeName,
                            EmployeeID = employeeId
                        }
                        ).ToList();
            }

            return data;
            
        }

        public void SavePromotion(PromotionViewModel promotionVM)
        {

            var promotion = mapper.Map<Promotion>(promotionVM);
            var employee = _context.Employees.Where(e=>e.EmployeeID== promotionVM.EmployeeID).FirstOrDefault();
            if(employee!=null)
            {
                employee.DesignationID = promotion.NewDesignationID;

                _context.Entry(employee).State = EntityState.Modified;
            }
            _context.Promotions.Add(promotion);
            _context.SaveChanges();
        }

        public void SaveSalaryIncrements(SalaryIncrementViewModel salaryIncrementVM, string userName)
        {

            updateSalaryMappings(salaryIncrementVM.IncrementAmount, salaryIncrementVM.EmployeeID, userName);
            var salaryIncrement = new SalaryIncrement
            {
                IncrementDate = salaryIncrementVM.IncrementDate,
                IncrementAmount = salaryIncrementVM.IncrementAmount,
                EmployeeID = salaryIncrementVM.EmployeeID,
                IsDeleted = false,
                LastModified = DateTime.Now,
                ModifiedBy = userName
            };
            _context.SalaryIncrements.Add(salaryIncrement);
            _context.SaveChanges();
        }

        private void updateSalaryMappings(decimal v, int employeeID, string userName)
        {
            decimal totalGross = 0;

            var res = (from s in _context.SalaryMappings
                       where s.EmployeeID == employeeID
                       group s by s.EmployeeID into data
                       select new
                       {
                           total = data.Sum(s => s.Amount)
                       }).SingleOrDefault();

            if (res != null)
            {
                totalGross = res.total + v;

                var basicsalary = (from s in _context.SalaryMappings
                                   where s.EmployeeID == employeeID && s.SalaryTypeID == 1
                                   select s).FirstOrDefault();
                basicsalary.Amount = Math.Round((totalGross - 2450) / Convert.ToDecimal(1.5));
                basicsalary.LastModified = DateTime.Now;
                basicsalary.ModifiedBy = userName;

                _context.SalaryMappings.Attach(basicsalary);
                _context.Entry(basicsalary).State = EntityState.Modified;


                var houseRent = (from s in _context.SalaryMappings
                                 where s.EmployeeID == employeeID && s.SalaryTypeID == 6
                                 select s).FirstOrDefault();
                houseRent.Amount = Math.Round(((totalGross - 2450) / Convert.ToDecimal(1.5) * Convert.ToDecimal(0.5)));
                houseRent.LastModified = DateTime.Now;
                houseRent.ModifiedBy = userName;
                _context.SalaryMappings.Attach(houseRent);
                _context.Entry(houseRent).State = EntityState.Modified;
                _context.SaveChanges();
            }

        }

        public List<SalaryIncrementViewModel> GetEmployeeeSalaryIncrementDetailsById(int employeeID)
        {
            List<SalaryIncrementViewModel> res = (from s in _context.SalaryIncrements
                                                  join e in _context.Employees on s.EmployeeID equals e.EmployeeID
                                                  where s.EmployeeID == employeeID
                                                  select new SalaryIncrementViewModel
                                                  {
                                                      SalaryIncrementID = s.SalaryIncrementID,
                                                      EmployeeID = s.EmployeeID,
                                                      IncrementAmount = s.IncrementAmount,
                                                      IncrementDate = s.IncrementDate,
                                                      CardNo = e.CardNo
                                                  }).ToList();
            return res;
        }

        public void InactiveEmployee(InactiveEmployeeViewModel inactiveEmployeeVM)
        {

            var inactiveEmployee = mapper.Map<InactiveEmployee>(inactiveEmployeeVM);
            var employee = _context.Employees.Where(e => e.EmployeeID == inactiveEmployeeVM.EmployeeID).FirstOrDefault();
            if (employee != null)
            {
                employee.IsActive = false;

                _context.Entry(employee).State = EntityState.Modified;
            }
            _context.InactiveEmployees.Add(inactiveEmployee);
            _context.SaveChanges();
        }

        public void ModifyCardNo(ChangeCardNoViewModel changeCardNoVM)
        {
            // Update Employee
            var cardMappingsInfo = (dynamic)null;
            var employeeInfo = (from e in _context.Employees
                                where e.CardNo == changeCardNoVM.OldCardNo
                                select e).SingleOrDefault();

            if (employeeInfo.TicketNo == null)
            {
                var totalNo = (from e in _context.Employees
                               where !e.CardNo.StartsWith("14")
                               select e).Count();

                employeeInfo.TicketNo = totalNo + 1;
            }

            employeeInfo.CardNo = changeCardNoVM.NewCardNo;
            employeeInfo.LastModified = changeCardNoVM.LastModified;
            employeeInfo.ModifiedBy = changeCardNoVM.ModifiedBy;
            employeeInfo.IsActive = true;
            _context.Employees.Attach(employeeInfo);
            _context.Entry(employeeInfo).State = EntityState.Modified;

            // Update or Insert into Card Mappings
            string acNo = string.Empty;


            if (!changeCardNoVM.OldCardNo.StartsWith("14"))
            {
                cardMappingsInfo = (from c in _context.CardNoMappings
                                    where c.OriginalCardNo == changeCardNoVM.OldCardNo
                                    select c).SingleOrDefault();
            }
            else
            {
                cardMappingsInfo = null;
            }

            if (cardMappingsInfo == null)
            {
                cardMappingsInfo = new CardNoMapping
                {
                    GeneratedCardNo = changeCardNoVM.NewCardNo,
                    OriginalCardNo = changeCardNoVM.NewCardNo,
                    Gender = "",
                    IsDeleted = false,
                    LastModified = changeCardNoVM.LastModified,
                    ModifiedBy = changeCardNoVM.ModifiedBy
                };

                _context.CardNoMappings.Add(cardMappingsInfo);
            }
            else
            {
                cardMappingsInfo.OriginalCardNo = changeCardNoVM.NewCardNo;

                _context.CardNoMappings.Attach(cardMappingsInfo);
                _context.Entry(cardMappingsInfo).State = EntityState.Modified;
            }

            // Attendance
            if (changeCardNoVM.OldCardNo.StartsWith("14"))
            {
                var tempCardMapping = (from c in _context.CardNoMappings
                                       where c.OriginalCardNo == changeCardNoVM.OldCardNo
                                       select c).SingleOrDefault();

                if (tempCardMapping != null)
                {
                    var attendanceList = (from c in _context.Attendances
                                          where c.CardNo == tempCardMapping.GeneratedCardNo
                                          && c.InOutTime >= employeeInfo.JoinDate
                                          select c).ToList();

                    attendanceList.ForEach(x => x.CardNo = cardMappingsInfo.GeneratedCardNo);
                    _context.Attendances.AddRange(attendanceList);
                }


            }

            _context.SaveChanges();
        }


    }
}
