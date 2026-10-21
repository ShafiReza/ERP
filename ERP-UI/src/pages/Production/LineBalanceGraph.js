import { useEffect, useState, useRef, createRef } from "react";
import { Row, Col, Form, Nav, Card } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Hour, Floor, FloorLine } from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactToPrint from "react-to-print";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const LineBalanceGraph = () => {
  const [productionStatusList, setProductionStatusList] = useState([]);
  const [itemExportList, setItemExportList] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    date: new Date().toISOString().split("T")[0],
  });
  let componentRef = useRef();

  useEffect(() => {
    if (
      searchCriteria.date &&
      searchCriteria.hour &&
      searchCriteria.floor &&
      searchCriteria.line
    ) {
      setProductionStatusList([]);
      fetch(
        process.env.REACT_APP_API_URL +
          "HourlyProduction/GetLineBalanceData?" +
          new URLSearchParams(searchCriteria),
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
          if (Array.isArray(response)) {
            setProductionStatusList(response);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [searchCriteria]);

  const getExcelData = () => {
    if (
      searchCriteria.date &&
      searchCriteria.hour &&
      searchCriteria.floor &&
      searchCriteria.line
    ) {
      fetch(
        process.env.REACT_APP_API_URL +
          "HourlyProduction/GetLineBalanceData?" +
          new URLSearchParams(searchCriteria),
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
          if (Array.isArray(response)) {
            setItemExportList(response);
            setTimeout(() => {
              csvLink.current.link.click();
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const headers = [
    { label: "Operation No", key: "OpeartionNo" },
    { label: "Output", key: "Output" },
    { label: "Down Time", key: "DownTime" },
    { label: "SAM", key: "Sam" },
    { label: "No Of WS", key: "NoOfWS" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-light border">
          <div className="p-2">
            <p className="fw-bold">{data.OpeartionNo}</p>
            <p className="text-primary">{`Target: ${data.Target}`}</p>
            <p className="text-success">{`Output: ${data.Output}`}</p>
            <p className="text-warning">{`No Of WS: ${data.NoOfWS}`}</p>
            <p className="text-danger">{`Downtime: ${data.DownTime ?? 0}`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <style>{`@media print {
  @page {
    size: landscape !important;
  }
  }`}</style>
      <Actionbar pageTitle="Line Balance Graph">
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="Line_Balance"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mb-2">
        <Col>
          <Row className="mt-2">
            <Form.Group as={Col}>
              <Floor
                onChange={(value) => {
                  setSearchCriteria({
                    ...searchCriteria,
                    floor: value ? value.value : "",
                  });
                }}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <FloorLine
                onChange={(value) => {
                  setSearchCriteria({
                    ...searchCriteria,
                    line: value ? value.value : "",
                  });
                }}
                selected={searchCriteria.line}
                floor={searchCriteria.floor}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control
                type="Date"
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    date: e.target.value,
                  })
                }
                value={searchCriteria.date}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Hour
                onChange={(value) => {
                  setSearchCriteria({
                    ...searchCriteria,
                    hour: value ? value.value : "",
                  });
                }}
              />
            </Form.Group>
          </Row>

          <Row className="mt-2">
            <Col>
              <Card ref={(el) => (componentRef = el)}>
                <Card.Body>
                  <ResponsiveContainer width="100%" aspect={3}>
                    <LineChart
                      data={productionStatusList}
                      margin={{ top: 10, right: 10, left: 25, bottom: 150 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="OpeartionNo"
                        tick={{ angle: -50, dy: 0 }}
                        interval={0}
                        textAnchor="end"
                      />
                      <YAxis tickCount={6} />
                      <Tooltip content={CustomTooltip} />
                      <Legend verticalAlign="top" />
                      <Line
                        type="monotone"
                        dataKey="Output"
                        stroke="#6610f2"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Target"
                        stroke="#fc3d03"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default LineBalanceGraph;
