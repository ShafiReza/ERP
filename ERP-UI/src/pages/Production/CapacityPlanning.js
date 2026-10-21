import { useState, Fragment, useRef } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  InputGroup,
  Button,
  Offcanvas,
  ProgressBar,
  Nav,
} from "react-bootstrap";
import ReactToPrint from "react-to-print";
import { Factory } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrderSummary from "../../components/merchant/OrderSummary";
import { CSVLink } from "react-csv";

const CapacityPlanning = () => {
  let componentRef = useRef();
  const [dataLoader, setDataLoader] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [capacityList, setCapacityList] = useState([]);
  const [totalCapacity, setTotalCapacity] = useState(0);
  const [totalLoad, setTotalLoad] = useState(0);
  const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
  const [totalCM, setTotalCM] = useState(0);
  const [criteria, setCriteria] = useState({});

  const GetCapacity = () => {
    setCapacityList([]);

    setDataLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "CapacityPlanning?" +
        new URLSearchParams(searchCriteria),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.length) {
          setCapacityList(result);

          setTotalCapacity(result.reduce((a, b) => a + b.AvailableMinutes, 0));
          setTotalLoad(result.reduce((a, b) => a + b.RequiredMinutes, 0));
          setTotalOrderQuantity(
            result.reduce((a, b) => a + b.OrderQuantity, 0)
          );
          setTotalCM(result.reduce((a, b) => a + b.TotalCM, 0));
        }

        setDataLoader(false);
      })
      .catch((err) => {
        setDataLoader(false);
      });
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    let list = [...capacityList];
    list[index][name] = value;

    list[index].AvailableMinutes =
      list[index].Worker *
      (1 - list[index].Absenteeism) *
      list[index].WorkDays *
      list[index].WorkHours *
      60 *
      list[index].Efficiency;

    setCapacityList(list);
  };

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  }

  const headers = [
    { label: "Year", key: "Year" },
    { label: "Month", key: "Month" },
    { label: "Factory Name", key: "FactoryName" },
    { label: "Order Quantity", key: "OrderQuantity" },
    { label: "TotalCM", key: "TotalCM" },
    { label: "Worker", key: "Worker" },
    { label: "Work Days", key: "WorkDays" },
    { label: "Work Hours", key: "WorkHours" },
    { label: "Absenteeism", key: "Absenteeism" },
    { label: "Efficiency", key: "Efficiency" },
    { label: "Available Minutes", key: "AvailableMinutes" },
    { label: "Required Minutes", key: "RequiredMinutes" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Capacity Planning">
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
        <CSVLink
          headers={headers}
          data={capacityList}
          filename="capacityplanning"
          className="text-success align-self-center text-decoration-none"
        >
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </CSVLink>
      </Actionbar>

      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Text>From</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  fromDate: e.target.value,
                })
              }
              type="date"
              name="fromDate"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  toDate: e.target.value,
                })
              }
              type="date"
              name="toDate"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Factory
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                factoryId: value ? value.value : null,
              });
            }}
          />
        </Form.Group>
        <Form.Group as={Col} sm="2">
          <Button
            variant="outline-primary"
            className="btn pull-right"
            onClick={() => {
              GetCapacity();
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-search" /> Search
          </Button>
        </Form.Group>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card className="mb-2" ref={(el) => (componentRef = el)}>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Factory</th>
                    <th>Order Quantity</th>
                    <th>Total CM</th>
                    <th>Worker</th>
                    <th>Days</th>
                    <th>Work Hours</th>
                    <th>Absenteeism</th>
                    <th>Efficiency</th>
                    <th>Capacity</th>
                    <th>Load</th>
                    <th>Balance</th>
                    <th colSpan="2">Booked Status</th>
                    <th>#</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoader && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!dataLoader && capacityList.length === 0 && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {capacityList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Year}</td>
                      <td>{toMonthName(item.Month)}</td>
                      <td>{item.FactoryName}</td>
                      <td>{item.OrderQuantity.toLocaleString()}</td>
                      <td>{item.TotalCM}</td>
                      <td>{item.Worker}</td>
                      <td style={{ width: 80 }}>
                        <Form.Control
                          onChange={(e) => handleChange(e, index)}
                          type="number"
                          size="sm"
                          name="WorkDays"
                          value={item.WorkDays}
                        />
                      </td>
                      <td>{item.WorkHours}</td>
                      <td>{item.Absenteeism * 100}%</td>
                      <td>{item.Efficiency * 100}%</td>
                      <td>
                        {item.AvailableMinutes.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {item.RequiredMinutes.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {(
                          item.AvailableMinutes - item.RequiredMinutes
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td style={{ width: 100 }}>
                        <ProgressBar>
                          <ProgressBar
                            animated
                            variant="success"
                            now={item.RequiredMinutes}
                            key={1}
                          />
                          {item.AvailableMinutes - item.RequiredMinutes > 0 && (
                            <ProgressBar
                              animated
                              variant="warning"
                              now={item.AvailableMinutes - item.RequiredMinutes}
                              key={2}
                            />
                          )}
                          {item.AvailableMinutes - item.RequiredMinutes < 0 && (
                            <ProgressBar
                              animated
                              variant="danger"
                              now={item.RequiredMinutes - item.AvailableMinutes}
                              key={3}
                            />
                          )}
                        </ProgressBar>
                      </td>
                      <td>
                        {(
                          (item.RequiredMinutes / item.AvailableMinutes) *
                          item.WorkHours
                        ).toFixed(1)}{" "}
                        Hours
                      </td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            setCriteria({
                              factoryId: item.FactoryId,
                              fromDate: new Date(item.Year, item.Month - 1, 2)
                                .toISOString()
                                .split("T")[0],
                              toDate: new Date(item.Year, item.Month, 1)
                                .toISOString()
                                .split("T")[0],
                            });
                            setShowCanvas(true);
                            e.stopPropagation();
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td colSpan="3">Total</td>
                    <td>
                      {totalOrderQuantity.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {totalCM.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td colSpan={5}></td>
                    <td>
                      {totalCapacity.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {totalLoad.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td>
                      {(totalCapacity - totalLoad).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td></td>
                    <td>
                      {((10 / totalCapacity) * totalLoad).toFixed(1)} Hours
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Order Status</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <OrderSummary searchCriteria={criteria} />
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
};

export default CapacityPlanning;
