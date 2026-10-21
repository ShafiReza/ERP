using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Reflection.Emit;

namespace ScopoERP.Domain.Models
{
    public partial class ScopoContext : DbContext
    {
        public ScopoContext()
            : base("name=ScopoContext")
        {
            var objectContext = (this as IObjectContextAdapter).ObjectContext;
            objectContext.CommandTimeout = 120;
        }

        public virtual DbSet<account> account { get; set; }
        public virtual DbSet<Applications> Applications { get; set; }
  
        public virtual DbSet<backtobacklc> backtobacklc { get; set; }
        public virtual DbSet<backtobacklchistory> backtobacklchistories { get; set; }
        public virtual DbSet<BackToBackLCPayment> BackToBackLCPayment { get; set; }
        public virtual DbSet<bank> bank { get; set; }
        public virtual DbSet<bankforwarding> bankforwarding { get; set; }
        public virtual DbSet<bl> bl { get; set; }
        public virtual DbSet<bldetails> bldetails { get; set; }
        public virtual DbSet<booking> booking { get; set; }
        public virtual DbSet<bookinghistory> bookinghistory { get; set; }
  
        public virtual DbSet<buyerinfo> buyerinfo { get; set; }
        public virtual DbSet<chalan> chalan { get; set; }
        public virtual DbSet<chalanexport> chalanexport { get; set; }
        public virtual DbSet<Company> Company { get; set; }
        public virtual DbSet<consumptionunit> consumptionunit { get; set; }
        public virtual DbSet<ContractConditions> ContractConditions { get; set; }
     
        public virtual DbSet<customerinfo> customerinfo { get; set; }
 
        public virtual DbSet<department> department { get; set; }
        public virtual DbSet<devision> devision { get; set; }

     
        public virtual DbSet<excessbooking> excessbooking { get; set; }
        public virtual DbSet<factory> factory { get; set; }
        public virtual DbSet<floorline> floorline { get; set; }
    

        public virtual DbSet<Costsheet> Costsheet { get; set; }
        public virtual DbSet<InventoryIssue> InventoryIssues { get; set; }
        public virtual DbSet<InventoryIssueDetails> InventoryIssueDetails { get; set; }
        public virtual DbSet<InventoryReceive> InventoryReceive { get; set; }
        public virtual DbSet<InventoryTrackings> InventoryTrackings { get; set; }
        public virtual DbSet<invoice> invoice { get; set; }
        public virtual DbSet<item> item { get; set; }
        public virtual DbSet<itemcategory> itemcategory { get; set; }
        public virtual DbSet<JobClasses> JobClasses { get; set; }
        public virtual DbSet<jobinfo> jobinfo { get; set; }

        public virtual DbSet<Memberships> Memberships { get; set; }
        public virtual DbSet<OperationCategories> OperationCategories { get; set; }
        public virtual DbSet<Operations> Operations { get; set; }
        public virtual DbSet<StyleOperations> StyleOperations { get; set; }
        public virtual DbSet<paymenttype> paymenttype { get; set; }
        public virtual DbSet<piinfo> piinfo { get; set; }
        public virtual DbSet<pocostsheet> pocostsheet { get; set; }
        public virtual DbSet<postyle> postyle { get; set; }
        public virtual DbSet<DailyProductionStatus> DailyProductionStatus { get; set; }
        public virtual DbSet<productionplanning> productionplanning { get; set; }
        public virtual DbSet<Profiles> Profiles { get; set; }
        public virtual DbSet<Realization> realization { get; set; }
        public virtual DbSet<realizationaccount> realizationaccount { get; set; }
        public virtual DbSet<requisition> requisition { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<season> season { get; set; }
        public virtual DbSet<shipment> shipment { get; set; }
        public virtual DbSet<sizecolor> sizecolor { get; set; }

        public virtual DbSet<styleinfo> styleinfo { get; set; }

        public virtual DbSet<supplier> supplier { get; set; }
        public virtual DbSet<Timelines> Timelines { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        public virtual DbSet<SupportTicketSystems> SupportTicketSystems { get; set; }
        public virtual DbSet<useraccount> useraccount { get; set; }

        public virtual DbSet<StoreReceive> StoreReceives { get; set; }
        public virtual DbSet<StoreIssue> StoreIssues { get; set; }
        public virtual DbSet<PurchaseRequisitionDetail> PurchaseRequisitionDetails { get; set; }
        public virtual DbSet<PurchaseRequisition> PurchaseRequisitions { get; set; }
        public virtual DbSet<FinancialYear> FinancialYears { get; set; }
        public virtual DbSet<CostCenter> CostCenters { get; set; }
        public virtual DbSet<VoucherType> VoucherTypes { get; set; }
        public virtual DbSet<Budget> Budgets { get; set; }
        public virtual DbSet<ParentAccount> ParentAccounts { get; set; }
        public virtual DbSet<TransactionDetail> TransactionDetails { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }     
        public virtual DbSet<TransactionSummary> TransactionSummaries { get; set; }
        public virtual DbSet<TransactionSummaryDaily> TransactionSummaryDailies { get; set; }
        public virtual DbSet<TransactionUnpostedDetail> TransactionUnpostedDetails { get; set; }
        public virtual DbSet<TransactionUnposted> TransactionUnposteds { get; set; }
        public virtual DbSet<AccSysAccountIdentity> AccSysAccountIdentities { get; set; }     
        public virtual DbSet<AccSysAccountType> AccSysAccountTypes { get; set; }
        public virtual DbSet<AccSysBranchTypeWiseAccount> AccSysBranchTypeWiseAccounts { get; set; }
        public virtual DbSet<CashFlowHead> CashFlowHeads { get; set; }
        public virtual DbSet<SubsidiaryAccount> SubsidiaryAccounts { get; set; }
        public virtual DbSet<AccPolicyLastNumber> AccPolicyLastNumbers { get; set; }     
        public virtual DbSet<AccSysGeneratedMethodID> AccSysGeneratedMethodIDs { get; set; }
        public virtual DbSet<HourlyProductionStatus> HourlyProductionStatus { get; set; }
        public virtual DbSet<DefectType> DefectTypes { get; set; }
        public virtual DbSet<DailyEarning> DailyEarnings { get; set; }
        public virtual DbSet<FloorLineProduction> FloorLineProductions { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<account>()
                .Property(e => e.AccountName)
                .IsUnicode(false);

            modelBuilder.Entity<account>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<account>()
                .HasMany(e => e.requisition)
                .WithRequired(e => e.account)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<account>()
                .HasMany(e => e.styleinfo)
                .WithRequired(e => e.account)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<account>()
                .HasMany(e => e.useraccount)
                .WithRequired(e => e.account)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applications>()
                .HasMany(e => e.Memberships)
                .WithRequired(e => e.Applications)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applications>()
                .HasMany(e => e.Roles)
                .WithRequired(e => e.Applications)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Applications>()
                .HasMany(e => e.Users)
                .WithRequired(e => e.Applications)
                .WillCascadeOnDelete(false);

   



            modelBuilder.Entity<backtobacklc>()
                .Property(e => e.BackToBackLCValue)
                .HasPrecision(15, 5);

            modelBuilder.Entity<backtobacklc>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<backtobacklc>()
                .HasMany(e => e.bl)
                .WithOptional(e => e.backtobacklc)
                .WillCascadeOnDelete();

            modelBuilder.Entity<BackToBackLCPayment>()
                .Property(e => e.PaymentValue)
                .HasPrecision(18, 4);

            modelBuilder.Entity<BackToBackLCPayment>()
                .Property(e => e.CreatedBy)
                .IsUnicode(false);

            modelBuilder.Entity<BackToBackLCPayment>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<bank>()
                .Property(e => e.BankName)
                .IsUnicode(false);

            modelBuilder.Entity<bank>()
                .Property(e => e.BankAddress)
                .IsUnicode(false);

            modelBuilder.Entity<bank>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<bankforwarding>()
                .Property(e => e.FDBPNo)
                .IsUnicode(false);

            modelBuilder.Entity<bankforwarding>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);



            modelBuilder.Entity<bl>()
                .Property(e => e.AcceptanceValue)
                .HasPrecision(20, 5);

            modelBuilder.Entity<bl>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<bl>()
                .HasMany(e => e.bldetails)
                .WithRequired(e => e.bl)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<bldetails>()
                .Property(e => e.ActualItemDescription)
                .IsUnicode(false);

            modelBuilder.Entity<bldetails>()
                .Property(e => e.InvoiceQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<bldetails>()
                .Property(e => e.ReceivedQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<bldetails>()
                .Property(e => e.IssuedQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<bldetails>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<booking>()
                .Property(e => e.ItemSize)
                .IsUnicode(false);

            modelBuilder.Entity<booking>()
                .Property(e => e.ItemColor)
                .IsUnicode(false);

            modelBuilder.Entity<booking>()
                .Property(e => e.TotalQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<booking>()
                .Property(e => e.UnitPrice)
                .HasPrecision(10, 5);

            modelBuilder.Entity<booking>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<bookinghistory>()
                .Property(e => e.ItemSize)
                .IsUnicode(false);

            modelBuilder.Entity<bookinghistory>()
                .Property(e => e.ItemColor)
                .IsUnicode(false);

            modelBuilder.Entity<bookinghistory>()
                .Property(e => e.TotalQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<bookinghistory>()
                .Property(e => e.UnitPrice)
                .HasPrecision(10, 5);

            modelBuilder.Entity<bookinghistory>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

      

            modelBuilder.Entity<buyerinfo>()
                .Property(e => e.BuyerName)
                .IsUnicode(false);

            modelBuilder.Entity<buyerinfo>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<buyerinfo>()
                .HasMany(e => e.styleinfo)
                .WithRequired(e => e.buyerinfo)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<chalan>()
                .Property(e => e.ChalanNo)
                .IsUnicode(false);

            modelBuilder.Entity<chalan>()
                .Property(e => e.ReceivedBy)
                .IsUnicode(false);

            modelBuilder.Entity<chalan>()
                .Property(e => e.Remarks)
                .IsUnicode(false);

            modelBuilder.Entity<chalan>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.ChalanNo)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.VehicleNo)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.DriverName)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.MobileNo)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.ShippedBy)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.SealNo)
                .IsUnicode(false);

            modelBuilder.Entity<chalanexport>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<Company>()
                .Property(e => e.CompanyName)
                .IsUnicode(false);

            modelBuilder.Entity<Company>()
                .Property(e => e.CPM)
                .HasPrecision(18, 4);

            modelBuilder.Entity<consumptionunit>()
                .Property(e => e.UnitName)
                .IsUnicode(false);

            modelBuilder.Entity<consumptionunit>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<consumptionunit>()
                .HasMany(e => e.booking)
                .WithRequired(e => e.consumptionunit)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<consumptionunit>()
                .HasMany(e => e.initialcostsheet)
                .WithRequired(e => e.consumptionunit)
                .HasForeignKey(e => e.ConsumptionUnitId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<consumptionunit>()
                .HasMany(e => e.initialcostsheet1)
                .WithRequired(e => e.consumptionunit1)
                .HasForeignKey(e => e.ConversionUnit)
                .WillCascadeOnDelete(false);

   

            modelBuilder.Entity<ContractConditions>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

        

            modelBuilder.Entity<customerinfo>()
                .Property(e => e.CustomerName)
                .IsUnicode(false);

            modelBuilder.Entity<customerinfo>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<customerinfo>()
                .HasMany(e => e.styleinfo)
                .WithRequired(e => e.customerinfo)
                .WillCascadeOnDelete(false);



            modelBuilder.Entity<department>()
                .Property(e => e.DepartmentName)
                .IsUnicode(false);

            modelBuilder.Entity<department>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<devision>()
                .Property(e => e.DevisionName)
                .IsUnicode(false);

            modelBuilder.Entity<devision>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<devision>()
                .HasMany(e => e.styleinfo)
                .WithRequired(e => e.devision)
                .WillCascadeOnDelete(false);



            modelBuilder.Entity<excessbooking>()
                .Property(e => e.ItemColor)
                .IsUnicode(false);

            modelBuilder.Entity<excessbooking>()
                .Property(e => e.ItemSize)
                .IsUnicode(false);

            modelBuilder.Entity<excessbooking>()
                .Property(e => e.TotalQuantity)
                .HasPrecision(20, 3);

            modelBuilder.Entity<excessbooking>()
                .Property(e => e.TotalPrice)
                .HasPrecision(20, 5);

            modelBuilder.Entity<excessbooking>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<factory>()
                .Property(e => e.FactoryName)
                .IsUnicode(false);

            modelBuilder.Entity<factory>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<factory>()
                .HasMany(e => e.postyle)
                .WithRequired(e => e.factory)
                .WillCascadeOnDelete(false);

      

            modelBuilder.Entity<floorline>()
                .Property(e => e.Floor)
                .IsUnicode(false);

            modelBuilder.Entity<floorline>()
                .Property(e => e.Line)
                .IsUnicode(false);

            modelBuilder.Entity<floorline>()
                .Property(e => e.Devision)
                .IsUnicode(false);

            modelBuilder.Entity<floorline>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

 

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.Consumption)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.Wastage)
                .HasPrecision(10, 5);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.ActualPrice)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.OfferToBuyer)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.ConversionQuantity)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.ActualConsumption)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.TotalRawMaterials)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.TotalCost)
                .HasPrecision(20, 10);

            modelBuilder.Entity<initialcostsheet>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<InventoryIssueDetails>()
                .Property(e => e.IssuedQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<InventoryIssueDetails>()
                .Property(e => e.RequestedQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<InventoryIssueDetails>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<InventoryReceive>()
                .Property(e => e.ReceivedQuantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<InventoryReceive>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<InventoryTrackings>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.InvoiceNo)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.InvoiceValue)
                .HasPrecision(20, 10);

            modelBuilder.Entity<invoice>()
                .Property(e => e.BL)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.BLToBeEndorsedTo)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.EXP)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.FCR)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.FDBP_No)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.Courier)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.TTNo)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.ShippingBill)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.PortOfLoading)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.FinalDestination)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.CountryName)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.PRCInvoiceAmount)
                .HasPrecision(18, 4);

            modelBuilder.Entity<invoice>()
                .Property(e => e.PRCValue)
                .HasPrecision(18, 4);

            modelBuilder.Entity<invoice>()
                .Property(e => e.PRCBDTaka)
                .HasPrecision(18, 4);

            modelBuilder.Entity<invoice>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.NotifyParty)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.ThirdNotifyParty)
                .IsUnicode(false);

            modelBuilder.Entity<invoice>()
                .Property(e => e.CATNo)
                .IsUnicode(false);

            modelBuilder.Entity<item>()
                .Property(e => e.ItemCode)
                .IsUnicode(false);

            modelBuilder.Entity<item>()
                .Property(e => e.ItemDescription)
                .IsUnicode(false);

            modelBuilder.Entity<item>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<item>()
                .HasMany(e => e.booking)
                .WithRequired(e => e.item)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<item>()
                .HasMany(e => e.initialcostsheet)
                .WithRequired(e => e.item)
                .WillCascadeOnDelete(false);

          

            modelBuilder.Entity<itemcategory>()
                .Property(e => e.Name)
                .IsUnicode(false);

            modelBuilder.Entity<itemcategory>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<itemcategory>()
                .HasMany(e => e.initialcostsheet)
                .WithRequired(e => e.itemcategory)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<itemcategory>()
                .HasMany(e => e.itemcategory1)
                .WithOptional(e => e.itemcategory2)
                .HasForeignKey(e => e.ParentCategoryId);

            modelBuilder.Entity<JobClasses>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<jobinfo>()
                .Property(e => e.JobNo)
                .IsUnicode(false);

            modelBuilder.Entity<jobinfo>()
                .Property(e => e.ContractNo)
                .IsUnicode(false);

            modelBuilder.Entity<jobinfo>()
                .Property(e => e.ExtraContractNo)
                .IsUnicode(false);

            modelBuilder.Entity<jobinfo>()
                .Property(e => e.AdvancedCMPercentage)
                .HasPrecision(7, 4);

            modelBuilder.Entity<jobinfo>()
                .Property(e => e.UDNo)
                .IsUnicode(false);

            modelBuilder.Entity<jobinfo>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            //modelBuilder.Entity<jobinfo>()
            //    .Property(e => e.LastUdAm)
            //    .IsUnicode(false);

            modelBuilder.Entity<jobinfo>()
                .HasMany(e => e.backtobacklc)
                .WithOptional(e => e.jobinfo)
                .HasForeignKey(e => e.JobID);

            modelBuilder.Entity<jobinfo>()
                .HasMany(e => e.excessbooking)
                .WithRequired(e => e.jobinfo)
                .HasForeignKey(e => e.JobID)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<jobinfo>()
                .HasMany(e => e.piinfo)
                .WithOptional(e => e.jobinfo)
                .HasForeignKey(e => e.LoanFromJobID);

            modelBuilder.Entity<jobinfo>()
                .HasMany(e => e.postyle)
                .WithOptional(e => e.jobinfo)
                .HasForeignKey(e => e.JobId);

            modelBuilder.Entity<jobinfo>()
                .HasMany(e => e.requisition)
                .WithRequired(e => e.jobinfo)
                .HasForeignKey(e => e.JobID)
                .WillCascadeOnDelete(false);

          

     

            //modelBuilder.Entity<machinecategory>()
            //    .HasMany(e => e.machine)
            //    .WithRequired(e => e.machinecategory)
            //    .WillCascadeOnDelete(false);

            //modelBuilder.Entity<machinecategory>()
            //    .HasMany(e => e.machinecategory1)
            //    .WithOptional(e => e.machinecategory2)
            //    .HasForeignKey(e => e.ParentCategoryID);

            modelBuilder.Entity<OperationCategories>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<OperationCategories>()
                .HasMany(e => e.Operations)
                .WithOptional(e => e.OperationCategories)
                .WillCascadeOnDelete();

            modelBuilder.Entity<Operations>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<paymenttype>()
                .Property(e => e.PaymentTitle)
                .IsUnicode(false);

            modelBuilder.Entity<paymenttype>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<paymenttype>()
                .HasMany(e => e.backtobacklc)
                .WithOptional(e => e.paymenttype)
                .HasForeignKey(e => e.LCTypeID);

            modelBuilder.Entity<piinfo>()
                .Property(e => e.ReferenceNo)
                .IsUnicode(false);

            modelBuilder.Entity<piinfo>()
                .Property(e => e.PINo)
                .IsUnicode(false);

            modelBuilder.Entity<piinfo>()
                .Property(e => e.BookedPo)
                .IsUnicode(false);

            modelBuilder.Entity<piinfo>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<piinfo>()
                .HasMany(e => e.excessbooking)
                .WithRequired(e => e.piinfo)
                .HasForeignKey(e => e.ProformaInvoiceID)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<pocostsheet>()
                .Property(e => e.CostSheetNo)
                .IsUnicode(false);

            modelBuilder.Entity<pocostsheet>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .Property(e => e.PoNo)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .Property(e => e.Fob)
                .HasPrecision(15, 10);

            modelBuilder.Entity<postyle>()
                .Property(e => e.AgreedCm)
                .HasPrecision(12, 7);

            modelBuilder.Entity<postyle>()
                .Property(e => e.Destination)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .Property(e => e.DCCode)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .Property(e => e.SubContractRate)
                .HasPrecision(10, 5);

            modelBuilder.Entity<postyle>()
                .Property(e => e.FactoryCM)
                .HasPrecision(12, 7);

            modelBuilder.Entity<postyle>()
                .Property(e => e.Remarks)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .Property(e => e.CostSheetNo)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<postyle>()
                .HasMany(e => e.booking)
                .WithRequired(e => e.postyle)
                .HasForeignKey(e => e.PurchaseOrderID)
                .WillCascadeOnDelete(false);

  

            modelBuilder.Entity<postyle>()
                .HasMany(e => e.productionplanning)
                .WithRequired(e => e.postyle)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<postyle>()
                .HasMany(e => e.shipment)
                .WithRequired(e => e.postyle)
                .HasForeignKey(e => e.PurchaseOrderID)
                .WillCascadeOnDelete(false);

      

            modelBuilder.Entity<productionplanning>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<Realization>()
                .Property(e => e.RealizedValue)
                .HasPrecision(18, 4);

            modelBuilder.Entity<Realization>()
                .Property(e => e.CurrencyRate)
                .HasPrecision(10, 4);

            modelBuilder.Entity<Realization>()
                .Property(e => e.PrcValue)
                .HasPrecision(18, 4);

            modelBuilder.Entity<Realization>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<realizationaccount>()
                .Property(e => e.RealizationAccountName)
                .IsUnicode(false);

            modelBuilder.Entity<realizationaccount>()
                .Property(e => e.RealizationAccountNo)
                .IsUnicode(false);

            modelBuilder.Entity<realizationaccount>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<requisition>()
                .Property(e => e.RequisitionNo)
                .IsUnicode(false);

            modelBuilder.Entity<requisition>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<Roles>()
                .HasMany(e => e.Users)
                .WithMany(e => e.Roles)
                .Map(m => m.ToTable("UsersInRoles").MapLeftKey("RoleId").MapRightKey("UserId"));

            modelBuilder.Entity<season>()
                .Property(e => e.SeasonName)
                .IsUnicode(false);

            modelBuilder.Entity<season>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<season>()
                .HasMany(e => e.postyle)
                .WithRequired(e => e.season)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<shipment>()
                .Property(e => e.CBM)
                .HasPrecision(10, 4);

            modelBuilder.Entity<shipment>()
                .Property(e => e.CartoonQuantity)
                .HasPrecision(10, 4);

            modelBuilder.Entity<shipment>()
                .Property(e => e.InvoiceFOB)
                .HasPrecision(18, 4);

            modelBuilder.Entity<shipment>()
                .Property(e => e.Destination)
                .IsUnicode(false);

            modelBuilder.Entity<shipment>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<sizecolor>()
                .Property(e => e.Size)
                .IsUnicode(false);

            modelBuilder.Entity<sizecolor>()
                .Property(e => e.Color)
                .IsUnicode(false);

            modelBuilder.Entity<sizecolor>()
                .Property(e => e.FOB)
                .HasPrecision(15, 10);

            modelBuilder.Entity<sizecolor>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);



            modelBuilder.Entity<styleinfo>()
                .Property(e => e.StyleNo)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.StyleDescription)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.Sam)
                .HasPrecision(5, 2);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.BodyStyle)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.Item)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.Febrication)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.HSCode)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<styleinfo>()
                .HasMany(e => e.initialcostsheet)
                .WithRequired(e => e.styleinfo)
                .WillCascadeOnDelete(false);




            modelBuilder.Entity<supplier>()
                .Property(e => e.SupplierName)
                .IsUnicode(false);

            modelBuilder.Entity<supplier>()
                .Property(e => e.Address)
                .IsUnicode(false);

            modelBuilder.Entity<supplier>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<supplier>()
                .Property(e => e.ContactNumber)
                .IsUnicode(false);

            modelBuilder.Entity<supplier>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);


        

            modelBuilder.Entity<Users>()
                .HasOptional(e => e.Memberships)
                .WithRequired(e => e.Users);

            modelBuilder.Entity<Users>()
                .HasOptional(e => e.Profiles)
                .WithRequired(e => e.Users);





            modelBuilder.Entity<SupportTicketSystems>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<SupportTicketSystems>()
                .Property(e => e.Department)
                .IsUnicode(false);

            modelBuilder.Entity<useraccount>()
                .Property(e => e.ModifiedBy)
                .IsUnicode(false);

            modelBuilder.Entity<AccSysAccountIdentity>()
               .HasMany(e => e.SubsidiaryAccounts)
               .WithRequired(e => e.AccSysAccountIdentity)
               .HasForeignKey(e => e.AccountIdentityNo)
               .WillCascadeOnDelete(false);

            modelBuilder.Entity<AccSysAccountType>()
                .HasMany(e => e.SubsidiaryAccounts)
                .WithRequired(e => e.AccSysAccountType)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<AccSysAccountType>()
                .HasMany(e => e.ParentAccounts)
                .WithRequired(e => e.AccSysAccountType)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<AccSysBranchTypeWiseAccount>()
                .HasMany(e => e.SubsidiaryAccounts)
                .WithRequired(e => e.AccSysBranchTypeWiseAccount)
                .HasForeignKey(e => e.BranchTypeWiseAccount)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<AccSysGeneratedMethodID>()
                .HasMany(e => e.AccPolicyLastNumbers)
                .WithRequired(e => e.AccSysGeneratedMethodID)
                .HasForeignKey(e => e.GeneratedMethod)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Budget>()
               .Property(e => e.Amount)
               .HasPrecision(18, 0);

            modelBuilder.Entity<CashFlowHead>()
                .HasMany(e => e.SubsidiaryAccounts)
                .WithRequired(e => e.CashFlowHead)
                .WillCascadeOnDelete(false);         

            modelBuilder.Entity<CostCenter>()
                .HasMany(e => e.TransactionDetails)
                .WithRequired(e => e.CostCenter)
                .WillCascadeOnDelete(false);



            modelBuilder.Entity<FinancialYear>()
                .Property(e => e.BookClosingAmount)
                .HasPrecision(18, 4);

            modelBuilder.Entity<ParentAccount>()
                .HasMany(e => e.SubsidiaryAccounts)
                .WithRequired(e => e.ParentAccount)
                .HasForeignKey(e => e.ParentID)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<ParentAccount>()
                .HasMany(e => e.ParentAccounts1)
                .WithOptional(e => e.ParentAccount1)
                .HasForeignKey(e => e.ParentID);

            modelBuilder.Entity<PurchaseRequisition>()
                .Property(e => e.RequisitionNo)
                .IsUnicode(false);

            modelBuilder.Entity<PurchaseRequisition>()
                .Property(e => e.Remarks)
                .IsUnicode(false);

            modelBuilder.Entity<PurchaseRequisition>()
                .HasMany(e => e.PurchaseRequisitionDetails);

            modelBuilder.Entity<PurchaseRequisitionDetail>()
                .Property(e => e.ProductDescription)
                .IsUnicode(false);

            modelBuilder.Entity<PurchaseRequisitionDetail>()
                .Property(e => e.Quantity)
                .HasPrecision(18, 4);

            modelBuilder.Entity<PurchaseRequisitionDetail>()
                .Property(e => e.UnitPrice)
                .HasPrecision(18, 4);

            modelBuilder.Entity<SubsidiaryAccount>()
                .HasMany(e => e.TransactionDetails)
                .WithRequired(e => e.SubsidiaryAccount)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<TransactionDetail>()
                .Property(e => e.DrCrAmount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Transaction>()
                .HasMany(e => e.TransactionDetails)
                .WithRequired(e => e.Transaction)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<TransactionSummary>()
                .Property(e => e.DrCrAmount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<TransactionSummaryDaily>()
                .Property(e => e.DrCrAmount)
                .HasPrecision(18, 0);

            modelBuilder.Entity<TransactionUnpostedDetail>()
                .Property(e => e.DrCrAmount)
                .HasPrecision(19, 4);

            modelBuilder.Entity<TransactionUnposted>()
                .HasMany(e => e.TransactionUnpostedDetails)
                .WithRequired(e => e.TransactionUnposted)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Costsheet>()
                    .Property(p => p.UnitPrice)
                    .HasPrecision(18, 6);

            modelBuilder.Entity<Costsheet>()
                    .Property(p => p.TotalPrice)
                    .HasPrecision(18, 6);
            modelBuilder.Entity<DailyEarning>()
                   .Property(p => p.CPM)
                   .HasPrecision(18, 4);

        }
    }
}
