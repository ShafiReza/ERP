import {
  useState,
  useEffect,
  createRef,
  Fragment,
  useRef,
  useCallback,
} from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  Offcanvas,
} from "react-bootstrap";
import ReactToPrint from "react-to-print";

import Actionbar from "../../components/layout/Actionbar";
import { Floor, FloorLine, SalesOrder, Hour } from "../../components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const ProductionStatus = () => {
  const [production, setProduction] = useState({
    ProductionDate: new Date(Date.now() - 864e5).toISOString().split("T")[0],
  });
  let componentRef = useRef();

  const [showCanvas, setShowCanvas] = useState(false);
  const [validated, setValidated] = useState(false);
  const [itemExportList, setItemExportList] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    productionDate: new Date(Date.now() - 864e5).toISOString().split("T")[0],
    poNo: "",
    floor: "ASWL -2",
    excelExport: false,
  });

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();

  const getAllProductionStatus = useCallback(() => {
    getData(
      "ProductionStatus/GetAllProductionStatus?" +
        new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllProductionStatus();
  }, [getAllProductionStatus]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = " ")
    );
    setProduction({
      ProductionDate: new Date(Date.now() - 864e5).toISOString().split("T")[0],
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProduction({ ...production, [name]: value });
  };

  const saveProduction = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    saveData("ProductionStatus", "POST", production, getAllProductionStatus);
  };

  const headers = [
    { label: "Floor", key: "Floor" },
    { label: "Line", key: "Line" },
    { label: "StyleNo", key: "StyleNo" },
    { label: "PO No", key: "PurchaseOrderNo" },
    { label: "Order Quantity", key: "OrderQuantity" },
    { label: "Cutting", key: "Cutting" },
    { label: "Sewing", key: "Sewing" },
    { label: "Total Sewing", key: "TotalSewing" },
    { label: "Sewing Balance", key: "SewingBalance" },
    { label: "Printing", key: "Printing" },
    { label: "Washing", key: "Washing" },
    { label: "Finishing", key: "Finishing" },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Production Status">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setProduction({
              ProductionDate: new Date(Date.now() - 864e5)
                .toISOString()
                .split("T")[0],
            });
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="Production Status.csv"
          className="hidden"
          ref={csvLink}
        />
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col>
          <Row>
            <Form.Group as={Col} sm="3">
              <Form.Control
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    productionDate: e.target.value,
                  })
                }
                type="date"
                name="productionDate"
                value={searchCriteria.productionDate}
              />
            </Form.Group>
            <Form.Group as={Col} sm="3">
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
            </Form.Group>
          </Row>
        </Col>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card ref={(el) => (componentRef = el)}>
            <Card.Body>
              <Table responsive bordered striped hover size="sm">
                <thead>
                  <tr className="text-center">
                    <th style={{ minWidth: 100 }}>Floor</th>
                    <th>Line</th>
                    <th>Hour</th>
                    <th style={{ minWidth: 130 }}>Style No</th>
                    <th style={{ minWidth: 130 }}>PO No</th>
                    <th>Order Qty</th>
                    <th>Color</th>
                    <th>Cutting</th>
                    <th>Sewing Input</th>
                    <th>Sewing</th>
                    <th>Printing</th>
                    <th>Sent to Wash</th>
                    <th>Washing</th>
                    <th>Finishing Input</th>
                    <th>Finishing</th>
                    <th>Machine</th>
                    <th></th>
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
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        onClick={() => {
                          setProduction(item);
                        }}
                        className={
                          item.Id === production.Id ? "table-active" : ""
                        }
                      >
                        <td>{item.Floor}</td>
                        <td>{item.Line}</td>
                        <td>{item.Hour}</td>
                        <td>{item.StyleNo}</td>
                        <td>{item.PurchaseOrderNo}</td>
                        <td className="text-end">{item.OrderQuantity}</td>
                        <td>{item.Color}</td>
                        <td className="text-end">{item.Cutting}</td>
                        <td className="text-end">{item?.SewingInput}</td>
                        <td className="text-end">{item.Sewing}</td>
                        <td className="text-end">{item?.Printing}</td>
                        <td className="text-end">{item?.SentToWash}</td>
                        <td className="text-end">{item?.Washing}</td>
                        <td className="text-end">{item.FinishingInput}</td>
                        <td className="text-end">{item.Finishing}</td>
                        <td className="text-end">{item.RunningMachine}</td>
                        <td className="text-center">
                          <Button
                            variant="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setShowCanvas(true);
                            }}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-pen" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="fw-bold text-end">
                    <td colSpan="7">Total</td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.Cutting);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.SewingInput);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.Sewing);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.Printing);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.SentToWash);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.Washing);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.FinishingInput);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.Finishing);
                      }, 0)}
                    </td>
                    <td>
                      {res.data.reduce((total, item) => {
                        return (total += item.RunningMachine);
                      }, 0)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-75"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Production Status:</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveProduction}
                method="POST"
              >
                <Row className="mb-2">
                  <Form.Group as={Col} sm="4">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="ProductionDate"
                      value={production.ProductionDate}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="2">
                    <Form.Label>Hour</Form.Label>
                    <Hour
                      name="Hour"
                      onChange={(value, action) => {
                        setProduction({
                          ...production,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      selected={production.Hour}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>PO</Form.Label>
                    <SalesOrder
                      name="PurchaseOrderID"
                      onChange={(value, action) => {
                        setProduction({
                          ...production,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      selected={production.PurchaseOrderID}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col} sm="4">
                    <Form.Label>Floor</Form.Label>
                    <Floor
                      onChange={(value, action) =>
                        setProduction({
                          ...production,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="Floor"
                      selected={production.Floor}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="2">
                    <Form.Label>Line</Form.Label>
                    <FloorLine
                      onChange={(value, action) =>
                        setProduction({
                          ...production,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="Line"
                      selected={production.Line}
                      floor={production.Floor}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Running Machine</Form.Label>
                    <Form.Control
                      name="RunningMachine"
                      onChange={(e) => handleChange(e)}
                      value={production.RunningMachine}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="Color"
                      value={production.Color}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Today Cutting</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="Cutting"
                      value={production.Cutting}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Sewing Input</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="SewingInput"
                      value={production.SewingInput}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Today Sewing</Form.Label>
                    <Form.Control
                      type="number"
                      name="Sewing"
                      onChange={(e) => handleChange(e)}
                      value={production.Sewing}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Sent to Print</Form.Label>
                    <Form.Control
                      type="number"
                      name="SentToPrint"
                      onChange={(e) => handleChange(e)}
                      value={production.SentToPrint}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Today Print</Form.Label>
                    <Form.Control
                      type="number"
                      name="Printing"
                      onChange={(e) => handleChange(e)}
                      value={production.Printing}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Sent to Wash</Form.Label>
                    <Form.Control
                      type="number"
                      name="SentToWash"
                      onChange={(e) => handleChange(e)}
                      value={production.SentToWash}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Today Wash</Form.Label>
                    <Form.Control
                      type="number"
                      name="Washing"
                      onChange={(e) => handleChange(e)}
                      value={production.Washing}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Finishing Input</Form.Label>
                    <Form.Control
                      type="number"
                      name="FinishingInput"
                      onChange={(e) => handleChange(e)}
                      value={production.FinishingInput}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Today Finishing</Form.Label>
                    <Form.Control
                      type="number"
                      name="Finishing"
                      onChange={(e) => handleChange(e)}
                      value={production.Finishing}
                    />
                  </Form.Group>
                </Row>

                <Button
                  variant="light"
                  type="cancel"
                  onClick={handleReset}
                  as={Col}
                  className="mt-2"
                >
                  Reset
                </Button>
                {reqResponse.loading ? (
                  <Button variant="primary" disabled className="float-end mt-2">
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    type="submit"
                    className="float-end mt-2"
                  >
                    {production.Id ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default ProductionStatus;
