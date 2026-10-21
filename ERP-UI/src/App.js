import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import TopNavigation from "./components/layout/TopNavigation";
import Footer from "./components/layout/Footer";

import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Merchant/Booking";
import Requisition from "./pages/Purchases/Requisition";
import Billing from "./pages/Purchases/Billing";
import InventoryReceive from "./pages/Store/InventoryReceive";
import InventoryIssue from "./pages/Store/InventoryIssue";
import StockReport from "./pages/Store/StockReport";

import LabTest from "./pages/Production/LabTest";
import CapacityPlanning from "./pages/Production/CapacityPlanning";
import LinePlanning from "./pages/Production/LinePlanning";
import ProductionStatus from "./pages/Production/ProductionStatus";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import UserConfig from "./pages/user/UserConfig";

import BalanceSheet from "./pages/accounting/BalanceSheet";
import ParentAccount from "./pages/accounting/ParentAccount";
import ProfitLossStatement from "./pages/accounting/ProfitLossStatement";
import SubsidiaryAccount from "./pages/accounting/SubsidiaryAccount";
import TrialBalance from "./pages/accounting/TrialBalance";
import VocherEntry from "./pages/accounting/VoucherEntry";
import FinancialYear from "../src/pages/settings/FinancialYearSetup";
import CostCenter from "../src/pages/settings/CostCenterSetup";

import ChangePassword from "./pages/user/ChangePassword";

import LeaveEntry from "./pages/hr/LeaveEntry";
import AttendanceLog from "./pages/hr/AttendanceLog";
import Designation from "../src/pages/settings/Designation";
import DepartmentSetup from "../src/pages/settings/DepartmentSetup";
import EmployeeSetup from "../src/pages/settings/Employee";
import LeaveTypeSetup from "../src/pages/settings/LeaveTypeSetup";
import BankSetup from "../src/pages/Commercial/BankSetup";
import HolidaySetup from "../src/pages/settings/HolidaySetup";
import ProductionUnitSetup from "../src/pages/settings/ProductionUnitSetup";
import WorkingShiftSetup from "../src/pages/settings/WorkingShiftSetup";
import DeliveryChallan from "./pages/Store/DeliveryChallan";
import OrderStatus from "./pages/Merchant/OrderStatus";
import StoreTransfer from "./pages/Store/StoreTransfer";
import LedgerReport from "./pages/accounting/LedgerReport";
import LC from "./pages/Commercial/Lc";
import BackToBackLC from "./pages/Commercial/BackToBackLC";
import OperationBulletin from "./pages/Production/OperationBulletin";
import GumSheet from "./pages/Production/GumSheet";
import Cutting from "./pages/Production/Cutting";
import Coupon from "./pages/Production/Coupon";
import ItemSetup from "./pages/settings/ItemSetup";
import CustomerSetup from "./pages/settings/CustomerSetup";
import SupplierSetup from "./pages/settings/SupplierSetup";
import UnitSetup from "./pages/settings/UnitSetup";
import ProductionUnit from "../src/pages/settings/ProductionUnitSetup";
import ItemCategorySetup from "./pages/settings/ItemCategory";
import FactorySetup from "./pages/settings/FactorySetup";
import JobClass from "./pages/settings/JobClass";
import OperationSetup from "./pages/settings/OperationSetup";
import TNA from "./pages/Merchant/TNA";
import BillOfLading from "./pages/Commercial/BillOfLading";
import ExportInvoice from "./pages/Commercial/ExportInvoice";
import BankForwarding from "./pages/Commercial/BankForwarding";
import Realization from "./pages/Commercial/Realization";
import Style from "./pages/Merchant/Style";
import SalarySheet from "./pages/hr/SalarySheet";
import AbsentList from "./pages/hr/AbsentList";
import DetailsWorkingReport from "./pages/hr/DetailsWorkingReport";
import EmployeeCard from "./pages/hr/EmployeeCard";
import UserProfile from "./pages/user/UserProfile";
import BackToBackLCPayment from "./pages/Commercial/BackToBackLCPayment";
import SupportTicket from "./pages/IT/SupportTicket";
import AttendanceSheet from "./pages/hr/AttendanceSheet";
import AttendanceSummary from "./pages/hr/AttendanceSummary";
import Section from "./pages/settings/Section";
import HourlyProduction from "./pages/Production/HourlyProduction";
import LineBalanceGraph from "./pages/Production/LineBalanceGraph";
import ManPowerBudget from "./pages/settings/ManPowerBudget";
import HourlyProductionStatusReport from "./pages/Production/HourlyProductionStatusReport";
import ProductionReport from "./pages/reports/ProductionReport";
import DefectTypeSetup from "./pages/settings/DefectTypeSetup";
import EmployeeVarification from "./pages/hr/EmployeeVarification";
import ProductionEffeciency from "./pages/reports/ProductionEffeciency";
import MerchantRequisition from "./pages/Merchant/MerchantRequisition";
import ArchiveDataReport from "./pages/reports/ArchiveDataReport";
import ExcessBooking from "./pages/Merchant/ExcessBooking";

library.add(fas, far);

const App = () => {
  const token = localStorage.getItem("token");

  // let message = "Welcome to ArunimaERP!";

  // if (Notification.permission === "granted") {
  //   const notification = new Notification(message);
  // } else if (Notification.permission !== "denied") {
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       const notification = new Notification(message);
  //     }
  //   });
  // }

  return (
    <div>
      {token === null || token === "" || token === "Error" ? (
        <Navigate to="/login" />
      ) : (
        <div>
          <TopNavigation />

          <Container fluid>
            <Row>
              <Col sm className="mt-2 min-vh-100">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/salesorder" element={<OrderStatus />} />
                  <Route path="/requisition" element={<Requisition />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/excessbooking" element={<ExcessBooking />} />
                  <Route
                    path="/merchantrequisition"
                    element={<MerchantRequisition />}
                  />
                  <Route path="/ledgerreport" element={<LedgerReport />} />

                  <Route path="/storetransfer" element={<StoreTransfer />} />
                  <Route
                    path="/inventoryreceive"
                    element={<InventoryReceive />}
                  />
                  <Route path="/inventoryissue" element={<InventoryIssue />} />

                  <Route path="/stock-report" element={<StockReport />} />
                  <Route
                    path="/deliverychallan"
                    element={<DeliveryChallan />}
                  />
                  <Route
                    path="/production-status"
                    element={<ProductionStatus />}
                  />
                  <Route
                    path="/capacityplanning"
                    element={<CapacityPlanning />}
                  />
                  <Route
                    path="/linebalancegraph"
                    element={<LineBalanceGraph />}
                  />
                  <Route path="/lineplanning" element={<LinePlanning />} />
                  <Route path="/usersetup" element={<UserConfig />} />
                  <Route path="/changepassword" element={<ChangePassword />} />

                  <Route path="/balancesheet" element={<BalanceSheet />} />
                  <Route path="/parentaccount" element={<ParentAccount />} />
                  <Route
                    path="/profitlossstatement"
                    element={<ProfitLossStatement />}
                  />
                  <Route
                    path="/subsidiaryaccount"
                    element={<SubsidiaryAccount />}
                  />
                  <Route path="/trialbalance" element={<TrialBalance />} />
                  <Route path="/voucherentry" element={<VocherEntry />} />
                  <Route path="/attendence-log" element={<AttendanceLog />} />
                  <Route path="/salary-sheet" element={<SalarySheet />} />
                  <Route path="/absentlist" element={<AbsentList />} />
                  <Route
                    path="/attendance-sheet"
                    element={<AttendanceSheet />}
                  />
                  <Route
                    path="/attendance-summary"
                    element={<AttendanceSummary />}
                  />
                  <Route
                    path="/workingreport"
                    element={<DetailsWorkingReport />}
                  />
                  <Route path="/employeecard" element={<EmployeeCard />} />
                  <Route path="/leaveentry" element={<LeaveEntry />} />
                  <Route path="/financialyear" element={<FinancialYear />} />
                  <Route path="/costcenter" element={<CostCenter />} />
                  <Route path="/designation" element={<Designation />} />
                  <Route path="/department" element={<DepartmentSetup />} />
                  <Route path="/leavetypeSetup" element={<LeaveTypeSetup />} />
                  <Route path="/employee" element={<EmployeeSetup />} />
                  <Route path="/manpowerbudget" element={<ManPowerBudget />} />
                  <Route path="/holidaysetup" element={<HolidaySetup />} />
                  <Route path="/archivedata" element={<ArchiveDataReport />} />
                  <Route
                    path="/productionunitsetup"
                    element={<ProductionUnitSetup />}
                  />
                  <Route
                    path="/workingshiftsetup"
                    element={<WorkingShiftSetup />}
                  />
                  <Route path="/employee" element={<EmployeeSetup />} />
                  <Route
                    path="/employeevarification"
                    element={<EmployeeVarification />}
                  />
                  <Route path="/lc" element={<LC />} />
                  <Route path="/banksetup" element={<BankSetup />} />
                  <Route path="/backtobacklc" element={<BackToBackLC />} />
                  <Route
                    path="/backtobacklcpayment"
                    element={<BackToBackLCPayment />}
                  />
                  <Route path="/bill-of-lading" element={<BillOfLading />} />
                  <Route path="/exportinvoice" element={<ExportInvoice />} />
                  <Route path="/bankforwarding" element={<BankForwarding />} />
                  <Route path="/realization" element={<Realization />} />
                  <Route path="/style" element={<Style />} />
                  <Route path="/labtest" element={<LabTest />} />
                  <Route
                    path="/operation-bulletin"
                    element={<OperationBulletin />}
                  />
                  <Route path="/gumsheet" element={<GumSheet />} />
                  <Route path="/cutting" element={<Cutting />} />
                  <Route path="/coupon" element={<Coupon />} />
                  <Route path="/support-ticket" element={<SupportTicket />} />
                  <Route
                    path="/hourlyproduction"
                    element={<HourlyProduction />}
                  />
                  <Route
                    path="/hourlyproductionstatusreport"
                    element={<HourlyProductionStatusReport />}
                  />
                  <Route
                    path="/dailyproductionstatus"
                    element={<ProductionReport />}
                  />
                  <Route
                    path="/productionbyemployee"
                    element={<ProductionEffeciency />}
                  />

                  <Route path="/itemsetup" element={<ItemSetup />} />
                  <Route path="/customersetup" element={<CustomerSetup />} />
                  <Route path="/suppliersetup" element={<SupplierSetup />} />
                  <Route path="/unitsetup" element={<UnitSetup />} />
                  <Route path="/productionunit" element={<ProductionUnit />} />
                  <Route path="/itemcategory" element={<ItemCategorySetup />} />
                  <Route path="/factory-setup" element={<FactorySetup />} />
                  <Route path="/jobclass" element={<JobClass />} />
                  <Route path="/operationsetup" element={<OperationSetup />} />
                  <Route path="/defecttype" element={<DefectTypeSetup />} />

                  <Route path="/section" element={<Section />} />
                  <Route path="/user-profile" element={<UserProfile />} />

                  <Route path="/tna" element={<TNA />} />

                  <Route path="/" element={<Dashboard />} />
                </Routes>
              </Col>
              <Footer />
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default App;
