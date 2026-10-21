using ScopoERP.Domain.Models.HR;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace ScopoERP.Domain.Models
{
    public class HRContext : DbContext
    {
        public HRContext() : base("name=HRContext")
        {
            var objectContext = (this as IObjectContextAdapter).ObjectContext;
            objectContext.CommandTimeout = 120;
        }

        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<LeaveApplication> LeaveApplications { get; set; }
        public virtual DbSet<Attendance> Attendances { get; set; }
        public virtual DbSet<Section> Sections { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Branch> Branches { get; set; }
        public virtual DbSet<Designation> Designations { get; set; }
        public virtual DbSet<LeaveType> LeaveTypes { get; set; }
        public virtual DbSet<WorkingShift> WorkingShifts { get; set; }
        public virtual DbSet<SalaryType> SalaryTypes { get; set; }
        public virtual DbSet<SalaryMapping> SalaryMappings { get; set; }
        public virtual DbSet<Promotion> Promotions { get; set; }
        public virtual DbSet<SalaryIncrement> SalaryIncrements { get; set; }
        public virtual DbSet<InactiveEmployee> InactiveEmployees { get; set; }
        public virtual DbSet<ProductionFloorLine> ProductionFloorLines { get; set; }
        public virtual DbSet<SectionBudget> SectionBudgets { get; set; }
        public virtual DbSet<SpecialShift> SpecialShifts { get; set; }
        public virtual DbSet<CardNoMapping> CardNoMappings { get; set; }
        public virtual DbSet<BankSalary> BankSalaries { get; set; }
        public virtual DbSet<Holiday> Holidays { get; set; }
        public virtual DbSet<License> Licenses { get; set; }
        public virtual DbSet<SecurityGuardHoliday> SecurityGuardHoliday { get; set; }
        public virtual DbSet<SecurityGuardRoster> SecurityGuardRosters { get; set; }
        public virtual DbSet<EducationalQualification> EducationalQualification { get; set; }
        public virtual DbSet<Prescription> Prescriptions { get; set; }
        public virtual DbSet<Tax> Taxes { get; set; }
        public virtual DbSet<Loan> Loans { get; set; }
        public virtual DbSet<LoanDetails> LoanDetails { get; set; }
        public virtual DbSet<MonthlySalary> MonthlySalaries { get; set; }
        public virtual DbSet<Fine> Fines { get; set; }
        public virtual DbSet<Medicine> Medicines { get; set; }
        public virtual DbSet<MedicalRecord> MedicalRecord { get; set; }
        public virtual DbSet<Document> Documents { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SecurityGuardHoliday>().ToTable("SecurityGuardHoliday");
            modelBuilder.Entity<EducationalQualification>().ToTable("EducationalQualification");
            modelBuilder.Entity<MedicalRecord>().ToTable("MedicalRecord");
            base.OnModelCreating(modelBuilder);
        }
    }
}
