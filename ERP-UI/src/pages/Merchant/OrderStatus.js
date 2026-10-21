import {
  useState,
  createRef,
  Fragment,
  useRef,
  useCallback,
  useEffect,
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
  Dropdown,
  Badge,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Style,
  LC,
  Unit,
  Factory,
  SalesOrder,
  Season,
} from "../../components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import CostSheet from "../../components/merchant/CostSheet";
import DPR from "../../components/production/DPR";
import InventorySummary from "../../components/store/InventorySummary";
import SizeColor from "../../components/merchant/SizeColor";
const csvLink = createRef();

const OrderStatus = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [orderStatus, setOrderStatus] = useState({
    ExitDate: new Date().toISOString(),
    CurrentStatus: 1,
  });
  const [validated, setValidated] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  let componentRef = useRef();

  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllOrder = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("PurchaseOrders?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllOrder();
  }, [getAllOrder]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(response.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const handleRowClick = (item) => {
    setOrderStatus(item);
  };

  const handleOrderStatusChange = (event) => {
    let { name, value } = event.target;
    if (name === "FOB" || name === "AgreedCM" || name === "OrderQuantity") {
      value = parseFloat(value);
    }
    setOrderStatus({ ...orderStatus, [name]: value });
  };

  const saveSalesOrder = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = orderStatus.PurchaseOrderID ? "PUT" : "POST";
    saveData("PurchaseOrders", methodType, orderStatus, getAllOrder);
  };

  const deleteOrderStatus = () => {
    deleteData(
      "PurchaseOrders/" + orderStatus.PurchaseOrderID,
      "DELETE",
      null,
      getAllOrder
    );
  };

  const headers = [
    { label: "Order No", key: "PurchaseOrderNo" },
    { label: "Order Quantity", key: "OrderQuantity" },
    { label: "ExitDate", key: "ExitDate" },
    { label: "FOB", key: "FOB" },
    { label: "Agreed CM", key: "AgreedCM" },
    { label: "Style No", key: "StyleNo" },
    { label: "Buyer", key: "BuyerName" },
    { label: "Store", key: "FactoryName" },
    { label: "Job No", key: "JobNo" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Order Status">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setCanvasBody("add");
            setOrderStatus({
              ExitDate: new Date().toISOString(),
              CurrentStatus: 1,
            });
            setValidated(false);
          }}
          className="nav-link text-primary"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
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
          filename="OrderStatus"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2 mb-2">
        <Col>
          <Row className="mb-2">
            <Col>
              <Row>
                <Form.Group as={Col} sm="3">
                  <SalesOrder
                    onChange={(value) => {
                      setSearchCriteria({
                        ...searchCriteria,
                        purchaseOrderId: value ? value.value : null,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3">
                  <Style
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="styleId"
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3">
                  <LC
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="jobId"
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3">
                  <Factory
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="factoryId"
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card ref={(el) => (componentRef = el)}>
                <Card.Body>
                  <Table bordered hover striped size="sm">
                    <thead>
                      <tr>
                        <th>PO No</th>
                        <th>Order Qty</th>
                        <th>CRD</th>
                        <th>FOB</th>
                        <th>CM</th>
                        <th>Style No</th>
                        <th>SAM</th>
                        <th>Buyer</th>
                        <th>Job No</th>
                        <th>Total FOB</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {response.dataLoading && (
                        <tr>
                          <td colSpan="18" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!response.dataLoading && response.data?.length === 0 && (
                        <tr>
                          <td colSpan="18" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {response.data?.map((item, index) => (
                        <tr
                          key={item.PurchaseOrderID}
                          onClick={() => {
                            handleRowClick(item);
                          }}
                          className={
                            item.PurchaseOrderID === orderStatus.PurchaseOrderID
                              ? "table-active"
                              : ""
                          }
                        >
                          <td>{item.PurchaseOrderNo}</td>
                          <td>{item.OrderQuantity}</td>
                          <td>{item?.ExitDate}</td>
                          <td>{item.FOB}</td>
                          <td>{item.AgreedCM}</td>
                          <td>{item.StyleNo}</td>
                          <td>{item.Sam}</td>
                          <td>{item.BuyerName}</td>
                          <td>{item.JobNo}</td>
                          <td>
                            {(item.OrderQuantity * item.FOB).toLocaleString(
                              "eng",
                              { minimumFractionDigits: 2 }
                            )}
                          </td>
                          <td>
                            {item.CurrentStatus === 1 ? (
                              <Badge bg="primary">Confirmed</Badge>
                            ) : item.CurrentStatus === 0 ? (
                              <Badge bg="danger">Canceled</Badge>
                            ) : item.CurrentStatus === 2 ? (
                              <Badge bg="warning">Dummy</Badge>
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="d-flex">
                            <Button
                              variant="btn btn-sm btn-outline-primary ms-1"
                              onClick={() => {
                                setShowCanvas(true);
                                setCanvasBody("add");
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-pen" />
                            </Button>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="btn btn-sm btn-outline-success ms-1"
                                id="dropdown-basic"
                              >
                                <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item
                                  className="border-bottom"
                                  onClick={() => {
                                    setShowCanvas(true);
                                    setCanvasBody("costsheet");
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-angle-right"
                                    className="text-primary"
                                  />{" "}
                                  Cost Sheet
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className="border-bottom"
                                  onClick={() => {
                                    setShowCanvas(true);
                                    setCanvasBody("sizeColorMapping");
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-angle-right"
                                    className="text-primary"
                                  />{" "}
                                  Size Color Mapping
                                </Dropdown.Item>
                                <Dropdown.Item
                                  className="border-bottom"
                                  onClick={() => {
                                    setShowCanvas(true);
                                    setCanvasBody("productionStatus");
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-angle-right"
                                    className="text-primary"
                                  />{" "}
                                  Production Status
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => {
                                    setShowCanvas(true);
                                    setCanvasBody("inventoryStatus");
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-angle-right"
                                    className="text-primary"
                                  />{" "}
                                  Inventory Status
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => {
                                    setShowDialog(true);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon="fa-solid fa-angle-right"
                                    className="text-primary"
                                  />{" "}
                                  Delete Order
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                      <tr className="fw-bold">
                        <td></td>
                        <td>
                          {response.data?.reduce((total, ele) => {
                            return (total += ele.OrderQuantity);
                          }, 0)}
                        </td>
                        <td colSpan={7}></td>
                        <td>
                          {response.data
                            ?.reduce((total, ele) => {
                              return (total += ele.OrderQuantity * ele.FOB);
                            }, 0)
                            .toLocaleString("eng", {
                              minimumFractionDigits: 2,
                            })}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-75"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {canvasBody === "add"
              ? "Create/Update Order"
              : canvasBody === "productionStatus"
              ? "Production Status"
              : canvasBody === "inventoryStatus"
              ? "Inventory Status"
              : canvasBody === "costsheet"
              ? "Cost Sheet"
              : "Size Color Mapping"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              {canvasBody === "add" && (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveSalesOrder}
                  method="POST"
                >
                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>PO No</Form.Label>
                      <Form.Control
                        onChange={(e) => handleOrderStatusChange(e)}
                        type="text"
                        name="PurchaseOrderNo"
                        value={orderStatus.PurchaseOrderNo}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Style</Form.Label>
                      <Style
                        onChange={(value, action) => {
                          setOrderStatus({
                            ...orderStatus,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="StyleID"
                        selected={orderStatus.StyleNo}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>Job/LC</Form.Label>
                      <LC
                        onChange={(value, action) =>
                          setOrderStatus({
                            ...orderStatus,
                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="JobID"
                        selected={orderStatus.JobID}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Factory</Form.Label>
                      <Factory
                        onChange={(value, action) =>
                          setOrderStatus({
                            ...orderStatus,
                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="FactoryID"
                        selected={orderStatus.FactoryID}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        onChange={(e) => handleOrderStatusChange(e)}
                        type="number"
                        name="OrderQuantity"
                        value={orderStatus.OrderQuantity}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Unit</Form.Label>
                      <Unit
                        onChange={(value, action) => {
                          setOrderStatus({
                            ...orderStatus,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="UnitID"
                        selected={orderStatus.UnitID}
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm="6">
                      <Form.Label>Exit Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleOrderStatusChange(e)}
                        type="date"
                        name="ExitDate"
                        value={orderStatus?.ExitDate?.split("T")[0]}
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>FOB</Form.Label>
                      <Form.Control
                        onChange={(e) => handleOrderStatusChange(e)}
                        type="number"
                        name="FOB"
                        value={orderStatus.FOB}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>AgreedCM</Form.Label>
                      <Form.Control
                        onChange={(e) => handleOrderStatusChange(e)}
                        type="number"
                        name="AgreedCM"
                        value={orderStatus.AgreedCM}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Season</Form.Label>
                      <Season
                        onChange={(value, action) => {
                          setOrderStatus({
                            ...orderStatus,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="SeasonID"
                        selected={orderStatus.SeasonID}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        onChange={(e) => handleOrderStatusChange(e)}
                        type="number"
                        name="CurrentStatus"
                        value={orderStatus.CurrentStatus}
                        required
                      >
                        <option value="1">Confirmed</option>
                        <option value="2">Dummy</option>
                        <option value="0">Canceled</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  {reqResponse.loading ? (
                    <Button
                      variant="outline-primary"
                      disabled
                      className="float-end"
                    >
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
                      className="float-end"
                    >
                      Save
                    </Button>
                  )}
                </Form>
              )}
              {canvasBody === "sizeColorMapping" && (
                <SizeColor orderStatus={orderStatus} />
              )}
              {canvasBody === "productionStatus" && (
                <DPR PurchaseOrderId={orderStatus.PurchaseOrderID} />
              )}
              {canvasBody === "inventoryStatus" && (
                <InventorySummary
                  searchCriteria={{ poId: orderStatus.PurchaseOrderID }}
                />
              )}
              {canvasBody === "costsheet" && (
                <CostSheet orderStatus={orderStatus} />
              )}
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />

      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteOrderStatus}
      />
    </Fragment>
  );
};

export default OrderStatus;
