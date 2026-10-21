import { useState, useRef, useCallback, createRef } from "react";
import {
  Row,
  Col,
  Card,
  Spinner,
  Nav,
  Table,
  Form,
  Button,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Floor } from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactToPrint from "react-to-print";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const ProductionReport = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    floor: "ASWL -2",
    productionDate: new Date().toISOString().split("T")[0],
  });
  const [itemExportList, setItemExportList] = useState([]);
  let componentRef = useRef();
  const [res, fetchSummary] = useFetch();

  const getProductionReport = useCallback(() => {
    fetchSummary(
      "Report/GetProductionReport?" + new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [fetchSummary, searchCriteria]);

  const getReport = () => {
    getProductionReport();
  };

  const getExcelData = () => {
    if (searchCriteria.productionDate) {
      fetch(
        process.env.REACT_APP_API_URL +
          "Report/GetProductionReport?" +
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
    { label: "Floor", key: "Floor" },
    { label: "Line", key: "Line" },
    { label: "Style No", key: "StyleNo" },
    { label: "Sewing Input", key: "SewingInput" },
    { label: "Sewing", key: "Sewing" },
    { label: "Cutting", key: "Cutting" },
    { label: "SentToWash", key: "SentToWash" },
    { label: "Washing", key: "Washing" },
    { label: "FinishingInput", key: "FinishingInput" },
    { label: "Finishing", key: "Finishing" },
    { label: "NoOfWS", key: "NoOfWS" },
    { label: "Efficiency", key: "Efficiency" },
    { label: "Cost", key: "Cost" },
    { label: "CMEarnings", key: "CMEarnings" },
  ];

  return (
    <div>
      <style>{`@media print {
  @page {
    size: landscape !important;
    margin: 5mm !important;
  }
  }`}</style>
      <Actionbar pageTitle="Production Report">
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
          filename="Production_Report"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col sm="3">
          <Form.Control
            type="date"
            value={searchCriteria.productionDate}
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                productionDate: e.target.value,
              })
            }
          />
        </Col>
        <Col sm="3">
          <Floor
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,

                [action.name]: value ? value.value : null,
              })
            }
            name="floor"
            selected={searchCriteria.floor}
          />
        </Col>
        <Col sm="3">
          <Button onClick={getReport}>Preview</Button>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card ref={(el) => (componentRef = el)}>
            <Card.Body>
              <Table bordered striped responsive hover>
                <thead>
                  <tr className="text-center">
                    <th>Floor</th>
                    <th>Line</th>
                    <th>Style</th>
                    <th>Cutting</th>
                    <th>Sewing Input</th>
                    <th>Today Sewing</th>
                    <th>Sent to Wash</th>
                    <th>Wash</th>
                    <th>Finishing Input</th>
                    <th>Today Finish</th>
                    <th>No Of WS</th>
                    <th>Cost</th>
                    <th>CMEarnings</th>
                    <th>Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Floor}</td>
                      <td>{item.Line}</td>
                      <td>{item.StyleNo}</td>
                      <td>{item.Cutting}</td>
                      <td>{item.SewingInput}</td>
                      <td>{item.Sewing}</td>
                      <td>{item.SentToWash}</td>
                      <td>{item.Washing}</td>
                      <td>{item.FinishingInput}</td>
                      <td>{item.Finishing}</td>
                      <td>{item.NoOfWS}</td>
                      <td>{item.Cost}</td>
                      <td>{item.CMEarnings}</td>
                      <td>{item.Efficiency}%</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan={11}>Total</td>

                    <td>
                      {res.data
                        .reduce((total, item) => {
                          return (total += item.Cost);
                        }, 0)
                        .toLocaleString("eng", {
                          minimumFractionDigits: 2,
                        })}
                    </td>
                    <td>
                      {" "}
                      {res.data
                        .reduce((total, item) => {
                          return (total += item.CMEarnings);
                        }, 0)
                        .toLocaleString("eng", {
                          minimumFractionDigits: 2,
                        })}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <ToastContainer autoClose={2000} />
        </Col>
      </Row>
    </div>
  );
};

export default ProductionReport;
