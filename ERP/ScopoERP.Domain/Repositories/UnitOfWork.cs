using ScopoERP.Domain.Models;

namespace ScopoERP.Domain.Repositories
{
    public class UnitOfWork
    {
        private ScopoContext db;

        public UnitOfWork(ScopoContext db)
        {
            this.db = db;
        }

        public void Save()
        {
            db.SaveChanges();
        }

        private IRepository<account> accountRepo;
        public IRepository<account> AccountRepository
        {
            get
            {
                if (this.accountRepo == null)
                {
                    this.accountRepo = new Repository<account>(db);
                }
                return accountRepo;
            }
        }

        private IRepository<buyerinfo> buyerRepo;
        public IRepository<buyerinfo> BuyerRepository
        {
            get
            {
                if (this.buyerRepo == null)
                {
                    this.buyerRepo = new Repository<buyerinfo>(db);
                }
                return buyerRepo;
            }
        }

        private IRepository<customerinfo> customerRepo;
        public IRepository<customerinfo> CustomerRepository
        {
            get
            {
                if (this.customerRepo == null)
                {
                    this.customerRepo = new Repository<customerinfo>(db);
                }
                return customerRepo;
            }
        }

        private IRepository<supplier> supplierRepo;
        public IRepository<supplier> SupplierRepository
        {
            get
            {
                if (this.supplierRepo == null)
                {
                    this.supplierRepo = new Repository<supplier>(db);
                }
                return supplierRepo;
            }
        }

        private IRepository<styleinfo> styleRepo;
        public IRepository<styleinfo> StyleRepository
        {
            get
            {
                if (this.styleRepo == null)
                {
                    this.styleRepo = new Repository<styleinfo>(db);
                }
                return styleRepo;
            }
        }

        private IRepository<postyle> purchaseOrderRepo;
        public IRepository<postyle> PurchaseOrderRepository
        {
            get
            {
                if (this.purchaseOrderRepo == null)
                {
                    this.purchaseOrderRepo = new Repository<postyle>(db);
                }
                return purchaseOrderRepo;
            }
        }

        private IRepository<SupportTicketSystems> supportTicketRepo;
        public IRepository<SupportTicketSystems> SupportTicketRepository
        {
            get
            {
                if(this.supportTicketRepo == null)
                {
                    this.supportTicketRepo = new Repository<SupportTicketSystems>(db);
                }
                return supportTicketRepo;
            }
        }

        private IRepository<sizecolor> sizeColorRepo;
        public IRepository<sizecolor> SizeColorRepository
        {
            get
            {
                if (this.sizeColorRepo == null)
                {
                    this.sizeColorRepo = new Repository<sizecolor>(db);
                }
                return sizeColorRepo;
            }
        }

        private IRepository<devision> divisionRepo;
        public IRepository<devision> DivisionRepository
        {
            get
            {
                if (this.divisionRepo == null)
                {
                    this.divisionRepo = new Repository<devision>(db);
                }
                return divisionRepo;
            }
        }

        private IRepository<factory> factoryRepo;
        public IRepository<factory> FactoryRepository
        {
            get
            {
                if (this.factoryRepo == null)
                {
                    this.factoryRepo = new Repository<factory>(db);
                }
                return factoryRepo;
            }
        }

        private IRepository<season> seasonRepo;
        public IRepository<season> SeasonRepository
        {
            get
            {
                if (this.seasonRepo == null)
                {
                    this.seasonRepo = new Repository<season>(db);
                }
                return seasonRepo;
            }
        }

        private IRepository<jobinfo> jobRepo;
        public IRepository<jobinfo> JobRepository
        {
            get
            {
                if (this.jobRepo == null)
                {
                    this.jobRepo = new Repository<jobinfo>(db);
                }
                return jobRepo;
            }
        }

        private IRepository<invoice> exportInvoiceRepo;
        public IRepository<invoice> ExportInvoiceRepository
        {
            get
            {
                if (this.exportInvoiceRepo == null)
                {
                    this.exportInvoiceRepo = new Repository<invoice>(db);
                }
                return exportInvoiceRepo;
            }
        }

        private IRepository<DailyProductionStatus> productionStatusRepo;
        public IRepository<DailyProductionStatus> ProductionStatusRepository
        {
            get
            {
                if (this.productionStatusRepo == null)
                {
                    this.productionStatusRepo = new Repository<DailyProductionStatus>(db);
                }
                return productionStatusRepo;
            }
        }

        private IRepository<HourlyProductionStatus> hourlyproductionStatusRepo;
        public IRepository<HourlyProductionStatus> HourlyProductionStatusRepository
        {
            get
            {
                if (this.hourlyproductionStatusRepo == null)
                {
                    this.hourlyproductionStatusRepo = new Repository<HourlyProductionStatus>(db);
                }
                return hourlyproductionStatusRepo;
            }
        }



        private IRepository<item> itemRepo;
        public IRepository<item> ItemRepository
        {
            get
            {
                if (this.itemRepo == null)
                {
                    this.itemRepo = new Repository<item>(db);
                }
                return itemRepo;
            }
        }

        /// <summary>
        /// Item Category
        /// </summary>
        private IRepository<itemcategory> itemCategoryRepo;
        public IRepository<itemcategory> ItemCategoryRepository
        {
            get
            {
                if (this.itemCategoryRepo == null)
                {
                    this.itemCategoryRepo = new Repository<itemcategory>(db);
                }
                return itemCategoryRepo;
            }
        }


        private IRepository<DefectType> defectTypeRepo;
        public IRepository<DefectType> DefectTypeRepository
        {
            get
            {
                if (this.defectTypeRepo == null)
                {
                    this.defectTypeRepo = new Repository<DefectType>(db);
                }
                return defectTypeRepo;
            }
        }

        /// <summary>
        /// Consumption Unit
        /// </summary>
        private IRepository<consumptionunit> consumptionUnitRepo;
        public IRepository<consumptionunit> ConsumptionUnitRepository
        {
            get
            {
                if (this.consumptionUnitRepo == null)
                {
                    this.consumptionUnitRepo = new Repository<consumptionunit>(db);
                }
                return consumptionUnitRepo;
            }
        }

        /// <summary>
        /// Costsheet
        /// </summary>
        private IRepository<Costsheet> costsheetRepo;
        public IRepository<Costsheet> CostsheetRepository
        {
            get
            {
                if (this.costsheetRepo == null)
                {
                    this.costsheetRepo = new Repository<Costsheet>(db);
                }
                return costsheetRepo;
            }
        }

        /// <summary>
        /// Booking
        /// </summary>
        private IRepository<booking> bookingRepo;
        public IRepository<booking> BookingRepository
        {
            get
            {
                if (this.bookingRepo == null)
                {
                    this.bookingRepo = new Repository<booking>(db);
                }
                return bookingRepo;
            }
        }

        /// <summary>
        /// Booking History
        /// </summary>
        private IRepository<bookinghistory> bookingHistoryRepo;
        public IRepository<bookinghistory> BookingHistoryRepository
        {
            get
            {
                if (this.bookingHistoryRepo == null)
                {
                    this.bookingHistoryRepo = new Repository<bookinghistory>(db);
                }
                return bookingHistoryRepo;
            }
        }

        private IRepository<piinfo> piRepo;
        public IRepository<piinfo> PIRepository
        {
            get
            {
                if (this.piRepo == null)
                {
                    this.piRepo = new Repository<piinfo>(db);
                }
                return piRepo;
            }
        }

        /// <summary>
        /// Back To Back LC
        /// </summary>
        private IRepository<backtobacklc> backToBackLCRepo;
        public IRepository<backtobacklc> BackToBackLCRepository
        {
            get
            {
                if (this.backToBackLCRepo == null)
                {
                    this.backToBackLCRepo = new Repository<backtobacklc>(db);
                }
                return backToBackLCRepo;
            }
        }


        private IRepository<backtobacklchistory> backtobacklchistoryRepo;
        public IRepository<backtobacklchistory> BacktobacklchistoryRepository
        {
            get
            {
                if (this.backtobacklchistoryRepo == null)
                {
                    this.backtobacklchistoryRepo = new Repository<backtobacklchistory>(db);
                }
                return backtobacklchistoryRepo;
            }
        }


        /// <summary>
        /// Back To Back LC Payment
        /// </summary>
        private IRepository<BackToBackLCPayment> backToBackLCPaymentRepo;
        public IRepository<BackToBackLCPayment> BackToBackLCPaymentRepository
        {
            get
            {
                if (this.backToBackLCPaymentRepo == null)
                {
                    this.backToBackLCPaymentRepo = new Repository<BackToBackLCPayment>(db);
                }
                return backToBackLCPaymentRepo;
            }
        }


        /// <summary>
        /// Payment/LC Type
        /// </summary>
        private IRepository<paymenttype> lcTypeRepo;
        public IRepository<paymenttype> LCTypeRepository
        {
            get
            {
                if (this.lcTypeRepo == null)
                {
                    this.lcTypeRepo = new Repository<paymenttype>(db);
                }
                return lcTypeRepo;
            }
        }

        /// <summary>
        /// Floor Line
        /// </summary>
        private IRepository<floorline> productionFloorRepo;
        public IRepository<floorline> ProductionFloorRepository
        {
            get
            {
                if (this.productionFloorRepo == null)
                {
                    this.productionFloorRepo = new Repository<floorline>(db);
                }
                return productionFloorRepo;
            }
        }

        /// <summary>
        /// Machine Category
        /// </summary>
        private IRepository<productionplanning> productionPlanningRepo;
        public IRepository<productionplanning> ProductionPlanningRepository
        {
            get
            {
                if (this.productionPlanningRepo == null)
                {
                    this.productionPlanningRepo = new Repository<productionplanning>(db);
                }
                return productionPlanningRepo;
            }
        }

        private IRepository<DailyEarning> dailyEarningRepo;
        public IRepository<DailyEarning> DailyEarningRepository
        {
            get
            {
                if (this.dailyEarningRepo == null)
                {
                    this.dailyEarningRepo = new Repository<DailyEarning>(db);
                }
                return dailyEarningRepo;
            }
        }

        private IRepository<FloorLineProduction> floorLineProductionRepo;
        public IRepository<FloorLineProduction> FloorLineProductionRepository
        {
            get
            {
                if (this.floorLineProductionRepo == null)
                {
                    this.floorLineProductionRepo = new Repository<FloorLineProduction>(db);
                }
                return floorLineProductionRepo;
            }
        }

        /// <summary>
        /// Export Chalan
        /// </summary>
        private IRepository<chalanexport> chalanExportRepo;
        public IRepository<chalanexport> ChalanExportRepository
        {
            get
            {
                if (this.chalanExportRepo == null)
                {
                    this.chalanExportRepo = new Repository<chalanexport>(db);
                }
                return chalanExportRepo;
            }
        }

        private IRepository<chalanexportdetails> chalanexportdetailsRepo;
        public IRepository<chalanexportdetails> chalanexportdetailsRepository
        {
            get
            {
                if (this.chalanexportdetailsRepo == null)
                {
                    this.chalanexportdetailsRepo = new Repository<chalanexportdetails>(db);
                }
                return chalanexportdetailsRepo;
            }
        }

        /// <summary>
        /// Shipment
        /// </summary>
        private IRepository<shipment> shipmentRepo;
        public IRepository<shipment> ShipmentRepository
        {
            get
            {
                if (this.shipmentRepo == null)
                {
                    this.shipmentRepo = new Repository<shipment>(db);
                }
                return shipmentRepo;
            }
        }

        /// <summary>
        /// User
        /// </summary>
        private IRepository<Users> userRepo;
        public IRepository<Users> UserRepository
        {
            get
            {
                if (this.userRepo == null)
                {
                    this.userRepo = new Repository<Users>(db);
                }
                return userRepo;
            }
        }

        /// <summary>
        /// User Account
        /// </summary>
        private IRepository<useraccount> userAccountRepo;
        public IRepository<useraccount> UserAccountRepository
        {
            get
            {
                if (this.userAccountRepo == null)
                {
                    this.userAccountRepo = new Repository<useraccount>(db);
                }
                return userAccountRepo;
            }
        }

        /// <summary>
        /// Shipment
        /// </summary>
        private IRepository<pocostsheet> pocostsheetRepo;
        public IRepository<pocostsheet> POCostsheetRepository
        {
            get
            {
                if (this.pocostsheetRepo == null)
                {
                    this.pocostsheetRepo = new Repository<pocostsheet>(db);
                }
                return pocostsheetRepo;
            }
        }

        /// <summary>
        /// BL
        /// </summary>
        private IRepository<bl> blRepo;
        public IRepository<bl> BLRepository
        {
            get
            {
                if (this.blRepo == null)
                {
                    this.blRepo = new Repository<bl>(db);
                }
                return blRepo;
            }
        }

        /// <summary>
        /// BL Details
        /// </summary>
        private IRepository<bldetails> blDetailsRepo;
        public IRepository<bldetails> BLDetailsRepository
        {
            get
            {
                if (this.blDetailsRepo == null)
                {
                    this.blDetailsRepo = new Repository<bldetails>(db);
                }
                return blDetailsRepo;
            }
        }

        /// <summary>
        /// Requisition
        /// </summary>
        private IRepository<requisition> requisitionRepo;
        public IRepository<requisition> RequisitionRepository
        {
            get
            {
                if (this.requisitionRepo == null)
                {
                    this.requisitionRepo = new Repository<requisition>(db);
                }
                return requisitionRepo;
            }
        }

        /// <summary>
        /// Excess Booking
        /// </summary>
        private IRepository<excessbooking> excessBookingRepo;
        public IRepository<excessbooking> ExcessBookingRepository
        {
            get
            {
                if (this.excessBookingRepo == null)
                {
                    this.excessBookingRepo = new Repository<excessbooking>(db);
                }
                return excessBookingRepo;
            }
        }

        /// <summary>
        /// Bank Forwarding
        /// </summary>
        private IRepository<bankforwarding> bankForwardingRepo;
        public IRepository<bankforwarding> BankForwardingRepository
        {
            get
            {
                if (this.bankForwardingRepo == null)
                {
                    this.bankForwardingRepo = new Repository<bankforwarding>(db);
                }
                return bankForwardingRepo;
            }
        }

        /// <summary>
        /// Realization
        /// </summary>
        private IRepository<Realization> realizationRepo;
        public IRepository<Realization> RealizationRepository
        {
            get
            {
                if (this.realizationRepo == null)
                {
                    this.realizationRepo = new Repository<Realization>(db);
                }
                return realizationRepo;
            }
        }

        /// <summary>
        /// Realization
        /// </summary>
        private IRepository<realizationaccount> realizationAccountRepo;
        public IRepository<realizationaccount> RealizationAccountRepository
        {
            get
            {
                if (this.realizationAccountRepo == null)
                {
                    this.realizationAccountRepo = new Repository<realizationaccount>(db);
                }
                return realizationAccountRepo;
            }
        }

        /// <summary>
        /// Bank
        /// </summary>
        private IRepository<bank> bankRepo;
        public IRepository<bank> BankRepository
        {
            get
            {
                if (this.bankRepo == null)
                {
                    this.bankRepo = new Repository<bank>(db);
                }
                return bankRepo;
            }
        }

        /// <summary>
        /// Role
        /// </summary>
        private IRepository<Roles> roleRepo;
        public IRepository<Roles> RoleRepository
        {
            get
            {
                if (this.roleRepo == null)
                {
                    this.roleRepo = new Repository<Roles>(db);
                }
                return roleRepo;
            }
        }

        /// <summary>
        /// Department
        /// </summary>
        private IRepository<department> departmentRepo;
        public IRepository<department> DepartmentRepository
        {
            get
            {
                if (this.departmentRepo == null)
                {
                    this.departmentRepo = new Repository<department>(db);
                }
                return departmentRepo;
            }
        }

        private IRepository<StyleOperations> styleOperationRepo;
        public IRepository<StyleOperations> StyleOperationRepository
        {
            get
            {
                if (this.styleOperationRepo == null)
                {
                    this.styleOperationRepo = new Repository<StyleOperations>(db);
                }

                return styleOperationRepo;
            }
        }

        private IRepository<Operations> standardOperationRepo;
        public IRepository<Operations> StandardOperationRepository
        {
            get
            {
                if (this.standardOperationRepo == null)
                {
                    this.standardOperationRepo = new Repository<Operations>(db);
                }
                return standardOperationRepo;
            }
        }

        private IRepository<JobClasses> jobClassRepo;
        public IRepository<JobClasses> JobClassRepository
        {
            get
            {
                if (this.jobClassRepo == null)
                {
                    this.jobClassRepo = new Repository<JobClasses>(db);
                }
                return jobClassRepo;
            }
        }





        private IRepository<InventoryIssue> inventoryissueRepo;
        public IRepository<InventoryIssue> InventoryissueRepository
        {
            get
            {
                if (this.inventoryissueRepo == null)
                {
                    this.inventoryissueRepo = new Repository<InventoryIssue>(db);
                }
                return inventoryissueRepo;
            }
        }

        private IRepository<InventoryIssueDetails> InventoryIssueDetailsRepo;
        public IRepository<InventoryIssueDetails> InventoryIssueDetailsRepository
        {
            get
            {
                if(this.InventoryIssueDetailsRepo == null)
                {
                    this.InventoryIssueDetailsRepo = new Repository<InventoryIssueDetails>(db);
                }
                return InventoryIssueDetailsRepo;
            }
        }

        private IRepository<OperationCategories> operationCategoryRepo;
        public IRepository<OperationCategories> OperationCategoryRepository
        {
            get
            {
                if (this.operationCategoryRepo == null)
                {
                    this.operationCategoryRepo = new Repository<OperationCategories>(db);
                }
                return operationCategoryRepo;
            }
        }

        private IRepository<Timelines> timeLineRepo;
        public IRepository<Timelines> TimeLineRepository
        {
            get
            {
                if (this.timeLineRepo == null)
                {
                    this.timeLineRepo = new Repository<Timelines>(db);
                }
                return timeLineRepo;
            }
        }

        private IRepository<Company> companyRepo;
        public IRepository<Company> CompanyRepository
        {
            get
            {
                if (this.companyRepo == null)
                {
                    this.companyRepo = new Repository<Company>(db);
                }
                return companyRepo;
            }
        }

        private IRepository<ContractConditions> ContractConditionRepo;
        public IRepository<ContractConditions> ContractConditionRepository
        {
            get
            {
                if (this.ContractConditionRepo == null)
                {
                    this.ContractConditionRepo = new Repository<ContractConditions>(db);
                }
                return ContractConditionRepo;
            }
        }


        private IRepository<InventoryReceive> InventoryReceiveRepo;
        public IRepository<InventoryReceive> InventoryReceiveRepository
        {
            get
            {
                if(this.InventoryReceiveRepo == null)
                {
                    this.InventoryReceiveRepo = new Repository<InventoryReceive>(db);
                }
                return InventoryReceiveRepo;
            }
        }

        private IRepository<StoreReceive> storeReceiveRepo;
        public IRepository<StoreReceive> StoreReceiveRepository
        {
            get
            {
                if (this.storeReceiveRepo == null)
                {
                    this.storeReceiveRepo = new Repository<StoreReceive>(db);
                }
                return storeReceiveRepo;
            }
        }
        private IRepository<StoreIssue> storeIssueRepo;
        public IRepository<StoreIssue> StoreIssueRepository
        {
            get
            {
                if (this.storeIssueRepo == null)
                {
                    this.storeIssueRepo = new Repository<StoreIssue>(db);
                }
                return storeIssueRepo;
            }
        }

        //Accounting

        private IRepository<PurchaseRequisition> purchaseRequisitionRepo;
        public IRepository<PurchaseRequisition> PurchaseRequisitionRepository
        {
            get
            {
                if (this.purchaseRequisitionRepo == null)
                {
                    this.purchaseRequisitionRepo = new Repository<PurchaseRequisition>(db);
                }
                return purchaseRequisitionRepo;
            }
        }

        private IRepository<PurchaseRequisitionDetail> purchaseRequisitionDetailsRepo;
        public IRepository<PurchaseRequisitionDetail> PurchaseRequisitionDetailsRepository
        {
            get
            {
                if (this.purchaseRequisitionDetailsRepo == null)
                {
                    this.purchaseRequisitionDetailsRepo = new Repository<PurchaseRequisitionDetail>(db);
                }
                return purchaseRequisitionDetailsRepo;
            }
        }

        private IRepository<FinancialYear> financialYearRepo;
        public IRepository<FinancialYear> FinancialYearRepository
        {
            get
            {
                if (this.financialYearRepo == null)
                {
                    this.financialYearRepo = new Repository<FinancialYear>(db);
                }
                return financialYearRepo;
            }
        }

        private IRepository<CostCenter> costCenterRepo;
        public IRepository<CostCenter> CostCenterRepository
        {
            get
            {
                if (this.costCenterRepo == null)
                {
                    this.costCenterRepo = new Repository<CostCenter>(db);
                }
                return costCenterRepo;
            }
        }

        private IRepository<VoucherType> voucherTypeRepo;
        public IRepository<VoucherType> VoucherTypeRepository
        {
            get
            {
                if (this.voucherTypeRepo == null)
                {
                    this.voucherTypeRepo = new Repository<VoucherType>(db);
                }
                return voucherTypeRepo;
            }
        }

        private IRepository<Budget> BudgetRepo;
        public IRepository<Budget> BudgetRepository
        {
            get
            {
                if (this.BudgetRepo == null)
                {
                    this.BudgetRepo = new Repository<Budget>(db);
                }
                return BudgetRepo;
            }
        }

        private IRepository<ParentAccount> parentAccountRepo;
        public IRepository<ParentAccount> ParentAccountRepository
        {
            get
            {
                if (this.parentAccountRepo == null)
                {
                    this.parentAccountRepo = new Repository<ParentAccount>(db);
                }
                return parentAccountRepo;
            }
        }


        private IRepository<SubsidiaryAccount> subsidiaryAccountRepo;
        public IRepository<SubsidiaryAccount> SubsidiaryAccountRepository
        {
            get
            {
                if (this.subsidiaryAccountRepo == null)
                {
                    this.subsidiaryAccountRepo = new Repository<SubsidiaryAccount>(db);
                }
                return subsidiaryAccountRepo;
            }
        }

        private IRepository<AccSysAccountType> accSysAccountTypeRepo;
        public IRepository<AccSysAccountType> AccSysAccountTypeRepository
        {
            get
            {
                if (this.accSysAccountTypeRepo == null)
                {
                    this.accSysAccountTypeRepo = new Repository<AccSysAccountType>(db);
                }
                return accSysAccountTypeRepo;
            }
        }

        private IRepository<Transaction> transactionRepo;
        public IRepository<Transaction> TransactionRepository
        {
            get
            {
                if (this.transactionRepo == null)
                {
                    this.transactionRepo = new Repository<Transaction>(db);
                }
                return transactionRepo;
            }
        }

        private IRepository<TransactionDetail> transactionDetailRepo;
        public IRepository<TransactionDetail> TransactionDetailRepository
        {
            get
            {
                if (this.transactionDetailRepo == null)
                {
                    this.transactionDetailRepo = new Repository<TransactionDetail>(db);
                }
                return transactionDetailRepo;
            }
        }

        private IRepository<TransactionUnposted> transactionUnpostedRepo;
        public IRepository<TransactionUnposted> TransactionUnpostedRepository
        {
            get
            {
                if (this.transactionUnpostedRepo == null)
                {
                    this.transactionUnpostedRepo = new Repository<TransactionUnposted>(db);
                }
                return transactionUnpostedRepo;
            }
        }

        private IRepository<TransactionUnpostedDetail> transactionUnpostedDetailRepo;
        public IRepository<TransactionUnpostedDetail> TransactionUnpostedDetailRepository
        {
            get
            {
                if (this.transactionUnpostedDetailRepo == null)
                {
                    this.transactionUnpostedDetailRepo = new Repository<TransactionUnpostedDetail>(db);
                }
                return transactionUnpostedDetailRepo;
            }
        }
        private IRepository<TransactionSummary> transactionSummaryRepo;
        public IRepository<TransactionSummary> TransactionSummaryRepository
        {
            get
            {
                if (this.transactionSummaryRepo == null)
                {
                    this.transactionSummaryRepo = new Repository<TransactionSummary>(db);
                }
                return transactionSummaryRepo;
            }
        }


        private IRepository<AccSysAccountIdentity> accSysAccountIdentityRepo;
        public IRepository<AccSysAccountIdentity> AccSysAccountIdentityRepository
        {
            get
            {
                if (this.accSysAccountIdentityRepo == null)
                {
                    this.accSysAccountIdentityRepo = new Repository<AccSysAccountIdentity>(db);
                }
                return accSysAccountIdentityRepo;
            }
        }

        private IRepository<AccSysBranchTypeWiseAccount> accSysBranchTypeWiseAccountRepo;
        public IRepository<AccSysBranchTypeWiseAccount> AccSysBranchTypeWiseAccountRepository
        {
            get
            {
                if (this.accSysBranchTypeWiseAccountRepo == null)
                {
                    this.accSysBranchTypeWiseAccountRepo = new Repository<AccSysBranchTypeWiseAccount>(db);
                }
                return accSysBranchTypeWiseAccountRepo;
            }
        }

        private IRepository<CashFlowHead> cashFlowRepo;
        public IRepository<CashFlowHead> CashFlowRepository
        {
            get
            {
                if (this.cashFlowRepo == null)
                {
                    this.cashFlowRepo = new Repository<CashFlowHead>(db);
                }
                return cashFlowRepo;
            }
        }

        private IRepository<AccPolicyLastNumber> lastNumber;
        public IRepository<AccPolicyLastNumber> AccPolicyLastNumberRepository
        {
            get
            {
                if (lastNumber == null)
                {
                    lastNumber = new Repository<AccPolicyLastNumber>(db);
                }
                return lastNumber;
            }
        }

        private IRepository<AccSysGeneratedMethodID> methodId;
        public IRepository<AccSysGeneratedMethodID> GeneratedMethodRepository
        {
            get
            {
                if (methodId == null)
                {
                    methodId = new Repository<AccSysGeneratedMethodID>(db);
                }
                return methodId;
            }
        }

    }
}
