import { Container, Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";

const TopNavigation = () => {
  let navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) ?? {};

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="text-primary">
          <Image
            src="/logo.jpg"
            height="30"
            className="d-inline-block align-top"
            alt="ScopoERP logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto my-2 my-lg-0">
            {(user.role === "MERCHANT" ||
              user.role === "PRODUCTION" ||
              user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-cart-arrow-down"
                      className="text-primary"
                    />{" "}
                    Sales
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/salesorder"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Order
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/style" className="nav-link">
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Style
                </NavDropdown.Item>

                {(user.role === "MERCHANT" ||
                  user.role === "ADMINISTRATOR") && (
                  <>
                    <NavDropdown.Item
                      as={Link}
                      to="/booking"
                      className="nav-link"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Booking
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Item
                  as={Link}
                  to="/merchantrequisition"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Merchant Requisition
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/excessbooking"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Excess Booking
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/lc" className="nav-link">
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  LC/Contract/Job
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {(user.role === "STORE" || user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-bag-shopping"
                      className="text-primary"
                    />{" "}
                    Purchases
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/requisition"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Requisition
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {(user.role === "STORE" || user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-store"
                      className="text-primary"
                    />{" "}
                    Store
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/inventoryreceive"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Receive
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/inventoryissue"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Issue
                </NavDropdown.Item>

                {/* <NavDropdown.Item
                  as={Link}
                  to="/storetransfer"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Store Transfer
                </NavDropdown.Item> */}

                <NavDropdown.Divider />

                <NavDropdown.Item
                  as={Link}
                  to="/stock-report"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Stock Report
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  as={Link}
                  to="/deliverychallan"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Delivery Challans
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {(user.role === "PRODUCTION" ||
              user.role === "DPR" ||
              user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-gears"
                      className="text-primary"
                    />{" "}
                    Production
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/capacityplanning"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Capacity Planning
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/lineplanning"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Line Planning
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/production-status"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Production Status
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  as={Link}
                  to="/operation-bulletin"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Operation Bulletin
                </NavDropdown.Item>

                {/* <NavDropdown.Item as={Link} to="/cutting" className="nav-link">
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Cutting
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/coupon" className="nav-link">
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Coupon
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/gumsheet" className="nav-link">
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Gum Sheet
                </NavDropdown.Item> */}
                <NavDropdown.Item
                  as={Link}
                  to="/hourlyproduction"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Hourly Production
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/linebalancegraph"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Line Balance Graph
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {(user.role === "ACCOUNTS" || user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-coins"
                      className="text-primary"
                    />{" "}
                    Accounts
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/voucherentry"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Voucher Entry
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  as={Link}
                  to="/trialbalance"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Trial Balance
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/balancesheet"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Balance Sheet
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/profitlossstatement"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Profit & Loss Statement
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/ledgerreport"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Ledger Report
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item
                  as={Link}
                  to="/realization"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Realization
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/backtobacklcpayment"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  B2B LC Payment
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {(user.role === "COMMERCIAL_IMPORT" ||
              user.role === "COMMERCIAL_EXPORT" ||
              user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-dollar-sign"
                      className="text-primary"
                    />{" "}
                    Commercial
                  </span>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/banksetup"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Bank
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/lc" className="nav-link">
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  LC/Contract/Job
                </NavDropdown.Item>
                <NavDropdown.Divider />

                {(user.role === "COMMERCIAL_IMPORT" ||
                  user.role === "ADMINISTRATOR") && (
                  <Fragment>
                    <NavDropdown.Item
                      as={Link}
                      to="/backtobacklc"
                      className="nav-link"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Back To Back LC
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/bill-of-lading"
                      className="nav-link"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Bill of Lading
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                  </Fragment>
                )}

                {(user.role === "COMMERCIAL_EXPORT" ||
                  user.role === "ADMINISTRATOR") && (
                  <Fragment>
                    <NavDropdown.Item
                      as={Link}
                      to="/exportinvoice"
                      className="nav-link"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Export Invoice
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/bankforwarding"
                      className="nav-link"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Bank Forwarding
                    </NavDropdown.Item>
                  </Fragment>
                )}
              </NavDropdown>
            )}
            {(user.role === "HR_PAYROLL" ||
              user.role === "COMPLIANCE" ||
              user.role === "ADMINISTRATOR") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-user-shield"
                      className="text-primary"
                    />{" "}
                    HR
                  </span>
                }
                id="basic-nav-dropdown"
              >
                {(user.role === "HR_PAYROLL" ||
                  user.role === "ADMINISTRATOR") && (
                  <span>
                    <NavDropdown.Item
                      as={Link}
                      to="/employee"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Employee
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/employeevarification"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Employee Varification
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/manpowerbudget"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Manpower Budget
                    </NavDropdown.Item>
                    {/* <NavDropdown.Item
                      as={Link}
                      to="/employeecard"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Employee Card
                    </NavDropdown.Item> */}

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      as={Link}
                      to="/attendence-log"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Attendance Log
                    </NavDropdown.Item>
                  </span>
                )}
               

                <NavDropdown.Item
                  as={Link}
                  to="/attendance-sheet"
                  className="nav-link text-primary"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Attendance Sheet
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/attendance-summary"
                  className="nav-link text-primary"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Attendance Summary
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={Link}
                  to="/archivedata"
                  className="nav-link text-primary"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Archive Data
                </NavDropdown.Item>

                {(user.role === "HR_PAYROLL" ||
                  user.role === "ADMINISTRATOR") && (
                  <span>
                    <NavDropdown.Item
                      as={Link}
                      to="/absentlist"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Absent Report
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      as={Link}
                      to="/leaveentry"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Leave Application
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      as={Link}
                      to="/salary-sheet"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Salary Sheet
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/workingreport"
                      className="nav-link text-primary"
                    >
                      <FontAwesomeIcon
                        icon="fa-solid fa-angle-right"
                        className="text-primary"
                      />{" "}
                      Working Report
                    </NavDropdown.Item>
                  </span>
                )}
              </NavDropdown>
            )}

            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon
                    icon="fa-solid fa-sliders"
                    className="text-primary"
                  />{" "}
                  Settings
                </span>
              }
              id="basic-nav-dropdown"
            >
              {user.role === "ADMINISTRATOR" && (
                <Fragment>
                  <NavDropdown.Item
                    as={Link}
                    to="/usersetup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    User
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/customersetup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Buyer
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/suppliersetup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Supplier
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/unitsetup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Unit
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/productionunit"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Production Floor
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/factory-setup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Factory
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/section"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Section
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/defecttype"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Defect Type
                  </NavDropdown.Item>
                </Fragment>
              )}

              {(user.role === "ADMINISTRATOR" || user.role === "MERCHANT") && (
                <Fragment>
                  <NavDropdown.Item
                    as={Link}
                    to="/itemsetup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Item
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/itemcategory"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Item Category
                  </NavDropdown.Item>
                </Fragment>
              )}

              {(user.role === "ADMINISTRATOR" ||
                user.role === "PRODUCTION") && (
                <Fragment>
                  <NavDropdown.Item
                    as={Link}
                    to="/jobclass"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    JobClass
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/operationsetup"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Operation
                  </NavDropdown.Item>
                </Fragment>
              )}

              {(user.role === "ADMINISTRATOR" || user.role === "ACCOUNTS") && (
                <Fragment>
                  <NavDropdown.Item
                    as={Link}
                    to="/subsidiaryaccount"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Chart of Accounts
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/parentaccount"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Parent Account
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/financialyear"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Financial Year
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/costcenter"
                    className="nav-link"
                  >
                    <FontAwesomeIcon
                      icon="fa-solid fa-angle-right"
                      className="text-primary"
                    />{" "}
                    Cost Center
                  </NavDropdown.Item>
                </Fragment>
              )}
            </NavDropdown>

            {(user.role === "ADMINISTRATOR" || user.role === "PRODUCTION") && (
              <NavDropdown
                title={
                  <span>
                    <FontAwesomeIcon
                      icon="fa-solid fa-file"
                      className="text-primary"
                    />{" "}
                    Reports
                  </span>
                }
                id="basic-nav-dropdown"
              >
                {/* <NavDropdown.Item
                  as={Link}
                  to="/hourlyproductionstatusreport"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Hourly Production Status
                </NavDropdown.Item> */}
                {/* <NavDropdown.Item
                  as={Link}
                  to="/productionbyemployee"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Production Effeciency
                </NavDropdown.Item> */}
                <NavDropdown.Item
                  as={Link}
                  to="/dailyproductionstatus"
                  className="nav-link"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Production Report
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/attendance-summary"
                  className="nav-link text-primary"
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-angle-right"
                    className="text-primary"
                  />{" "}
                  Attendance Summary
                </NavDropdown.Item>
                
              </NavDropdown>
            )}
          </Nav>

          <Nav>
            <NavLink to="/support-ticket" className="nav-link">
              <FontAwesomeIcon
                icon="fa-solid fa-headset"
                className="text-primary"
              />
            </NavLink>

            <NavLink to="/tna" className="nav-link">
              <FontAwesomeIcon
                icon="fa-regular fa-calendar-days"
                className="text-primary"
              />
            </NavLink>

            <NavDropdown
              title={
                <>
                  <FontAwesomeIcon
                    icon="fa-regular fa-user"
                    className="text-primary"
                  />{" "}
                  <span>{user?.fullName}</span>
                </>
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item
                className="text-center"
                as={Link}
                to="/user-profile"
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/changepassword">
                Change Password
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavigation;
