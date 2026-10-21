import { Table, Row, Col, Nav, Card, Image, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "../../Print.style.css";

const MerchantRequisitionReport = ({ RequisitionID }) => {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummarData] = useState({});
  let componentRef = useRef();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const pieData = [
    {
      name: "Back to Back LC Value",
      value: summaryData?.BackToBackLCValue,
    },
    {
      name: "Applied for Back to Back LC Value",
      value: summaryData?.AppliedForB2BLCValue,
    },

    {
      name: "Pending Back to Back LC Value",
      value: summaryData?.PendingB2BLCValue,
    },

    {
      name: "Available Budget",
      value: summaryData?.AvailableBudget,
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "Report/GetMerchantRequisitionReport?" +
        new URLSearchParams({ requisitionID: RequisitionID }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setSummarData(response);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [RequisitionID]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
        </div>
      );
    }

    return null;
  };

  const getYear = (date) => {
    const givenDate = new Date(date);

    // Get the year
    const year = givenDate.getFullYear();

    return year;
  };

  const getMonth = (date) => {
    const givenDate = new Date(date);

    // Get the month
    const month = givenDate.getMonth(); // Month starts from 0, so add 1
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[month];
  };

  const getWeek = (date) => {
    const givenDate = new Date(date);
    const year = givenDate.getFullYear();
    const month = givenDate.getMonth();
    const firstDate = new Date(year, month, 1);
    const dayOfWeekFirstDay = firstDate.getDay();
    const dayOfMonth = givenDate.getDate();
    const weekNumber = Math.ceil((dayOfMonth + dayOfWeekFirstDay) / 7);

    if (dayOfWeekFirstDay > 0 && dayOfMonth <= 7) {
      return 1;
    }

    return weekNumber;
  };

  return (
    <Row>
      <style>
        {`@media print {
            body {
              font-size: 12px;
              width: 210mm;
            }
          }`}
      </style>

      <div>
        <div className="text-end">
          <ReactToPrint
            trigger={() => (
              <Nav.Link className="nav-link text-primary">
                <FontAwesomeIcon icon="fa-solid fa-print" /> Print
              </Nav.Link>
            )}
            content={() => componentRef}
          />
        </div>
        <div ref={(el) => (componentRef = el)}>
          <Table>
            <thead>
              <th>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="d-flex">
                    <div>
                      <Image
                        src="/arunima.png"
                        style={{ height: 50, width: 70 }}
                        alt="Image"
                      />
                    </div>
                    <div>
                      <p className="fs-4 fw-bold">
                        Arunima Group <br />
                        Requisition Report
                      </p>
                    </div>
                  </div>
                </div>
              </th>
            </thead>
            <tbody>
              {loading === true ? (
                <td className="text-center">
                  <Spinner animation="border" variant="primary" />
                </td>
              ) : null}
              {loading === false ? (
                <td>
                  <Row className="mt-2">
                    <Col>
                      <Table bordered striped size="sm">
                        <thead>
                          <tr>
                            <th></th>
                            <th></th>
                            <th>Per PC</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Job No</td>
                            <td>{summaryData?.JobNo}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Contract No</td>
                            <td>{summaryData?.ContractNo}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Contract Value</td>
                            <td>{summaryData?.ContractValue}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Budget Value</td>
                            <td>{summaryData?.BudgetValue}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Order Quantity</td>
                            <td>{summaryData?.OrderQuantity}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Initial CM</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Initial SPM</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>CPM</td>
                            <td>{summaryData?.CPM}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Required Effeciency</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Required Minutes</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Required CM</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Required CM : FOB</td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Back to Back LC Value</td>
                            <td>{summaryData?.BackToBackLCValue}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Pending Back to Back LC Value</td>
                            <td>{summaryData?.PendingB2BLCValue}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Applied for Back to Back LC Value</td>
                            <td>{summaryData?.AppliedForB2BLCValue}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Total Value Till Now</td>
                            <td>{summaryData?.TotalValue}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Available Budget/value</td>
                            <td>{summaryData?.AvailableBudget}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Requisition No</td>
                            <td>{summaryData?.RequisitionNo}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Requisition Date</td>
                            <td>{summaryData?.RequisitionDate}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>First Shipment Date</td>
                            <td>{summaryData?.FirstShipmentDate}</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>Last Shipment Date</td>
                            <td>{summaryData?.LastShipmentDate}</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </Table>
                      <Card className="mt-2 mb-5">
                        <Card.Body>
                          <PieChart width={730} height={300}>
                            <Pie
                              data={pieData}
                              color="#000000"
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              fill="#8884d8"
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </Card.Body>
                      </Card>
                      <Table bordered striped size="sm" className="mb-5">
                        <thead>
                          <tr>
                            <th className="text-center" colSpan={5}>
                              Applied for Back to Back LC
                            </th>
                          </tr>
                          <tr>
                            <th>Supplier Name</th>
                            <th>Booking Type</th>
                            <th>PI No</th>
                            <th>PIValue</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaryData?.AppliedForB2BList?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{item.SupplierName}</td>
                                <td>{item.BookingType}</td>
                                <td>{item.PINo}</td>
                                <td>{item.PIValue}</td>
                                <td></td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                      <Table bordered striped size="sm" className="mb-5">
                        <thead>
                          <tr>
                            <th className="text-center" colSpan={5}>
                              Pending for Back To Back LC
                            </th>
                          </tr>
                          <tr>
                            <th>Supplier Name</th>
                            <th>PI No</th>
                            <th>Requisition Date</th>
                            <th>PIValue</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaryData?.PendingForB2BList?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{item.SupplierName}</td>
                                <td>{item.PINo}</td>
                                <td>{item.RequisitionDate}</td>
                                <td>{item.PIValue}</td>
                                <td></td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                      <Table bordered striped size="sm" className="mb-5">
                        <thead>
                          <tr>
                            <th className="text-center" colSpan={8}>
                              Already Opened Back To Back LC
                            </th>
                          </tr>
                          <tr>
                            <th>Back to Back LC</th>
                            <th>Back to Back LC Date</th>
                            <th>Back to Back LC Value</th>
                            <th>%</th>
                            <th>Supplier</th>
                            <th>PI NO</th>
                            <th>PIValue</th>
                            <th>LC Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaryData?.AlreadyOpenedB2BList?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{item.BackToBackLC}</td>
                                <td>{item.BackToBackLCDate}</td>
                                <td>{item.BackToBackLCValue}</td>
                                <td></td>
                                <td>{item.SupplierName}</td>
                                <td>{item.PINo}</td>
                                <td>{item.PIValue}</td>
                                <td>{item.LCType}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                      <Table bordered striped size="sm">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Month</th>
                            <th>Week</th>
                            <th>Total FOB</th>
                            <th>Total Budget</th>
                            <th>%</th>
                            <th>Total B2BLC Value</th>
                            <th>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaryData?.RequisitionPOList?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{getYear(item.ExitDate)}</td>
                                <td>{getMonth(item.ExitDate)}</td>
                                <td>{getWeek(item.ExitDate)}</td>
                                <td>{item.TotalFOB}</td>

                                <td>{item.TotalBudget}</td>
                                <td></td>
                                <td>{item.TotalB2BLCValue}</td>
                                <td></td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 100 }}>
                    <Col></Col>
                    <Col className="text-center border-top border-1 border-dark">
                      Prepared By
                    </Col>
                    <Col></Col>
                    <Col className="text-center border-top border-1 border-dark">
                      Recommended By
                    </Col>
                    <Col></Col>
                    <Col className="text-center border-top border-1 border-dark">
                      Approved By
                    </Col>
                    <Col></Col>
                  </Row>
                </td>
              ) : null}
            </tbody>
          </Table>
        </div>
      </div>
    </Row>
  );
};

export default MerchantRequisitionReport;
