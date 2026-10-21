/* eslint-disable no-native-reassign */
import { useState, createRef, Fragment, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Table,
  Offcanvas,
  Nav,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import { LC, Invoice, SalesOrder } from "../../components/DropDown";
import { CSVLink } from "react-csv";
import CommercialInvoice from "../../components/commercial/CommercialInvoice";
const csvLink = createRef();

const ExportInvoice = () => {
  const [selectedItemID, setSelectedItemID] = useState(undefined);
  const [validated, setValidated] = useState(false);
  const [showIsRequiredMsg, setShowIsRequiredMsg] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [exportInvoice, setExportInvoice] = useState({
    CATNo: "347",
    ShipmentList: [{}],
  });
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 0,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllExportInvoice = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("ExportInvoice?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllExportInvoice();
  }, [getAllExportInvoice]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(response.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleClose = () => {
    setShowCanvas(false);
    setShowIsRequiredMsg(false);
    setValidated(false);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setExportInvoice({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setExportInvoice({ ...exportInvoice, [name]: value });
  };

  const handleShipmentListChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...exportInvoice.ShipmentList];
    list[index][name] = value;

    setExportInvoice({ ...exportInvoice, ShipmentList: list });
  };

  const removeInputRowClick = (index) => {
    let list = [...exportInvoice.ShipmentList];
    list.splice(index, 1);
    setExportInvoice({ ...exportInvoice, ShipmentList: list });
  };

  const addRowClick = () => {
    setExportInvoice({
      ...exportInvoice,
      ShipmentList: [...exportInvoice.ShipmentList, {}],
    });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveExportInvoice = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false || !exportInvoice.JobID) {
      e.stopPropagation();
      setShowIsRequiredMsg(true);
      setValidated(true);
      return;
    } else {
      setShowIsRequiredMsg(false);
    }

    for (let i = 0; i < exportInvoice.ShipmentList.length; i++) {
      if (!exportInvoice.ShipmentList[i].PurchaseOrderID) {
        setShowIsRequiredMsg(true);
        return;
      }
    }

    const methodType = exportInvoice.InvoiceId ? "PUT" : "POST";
    saveData("ExportInvoice", methodType, exportInvoice, getAllExportInvoice);
  };

  const deleteExportInvoice = () => {
    deleteData(
      "ExportInvoice/" + exportInvoice.InvoiceId,
      "DELETE",
      null,
      getAllExportInvoice
    );
  };

  const getExportInvoiceById = (id) => {
    setShowCanvas(true);
    setExportInvoice({
      ShipmentList: [],
    });
    fetch(process.env.REACT_APP_API_URL + "ExportInvoice/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setExportInvoice(result);
        setSelectedItemID(result.InvoiceId);
      })
      .catch((err) => console.log(err));
  };

  const getPoById = (id, index) => {
    if (id === null) return;
    fetch(process.env.REACT_APP_API_URL + "PurchaseOrders/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        let tempShipmentList = exportInvoice.ShipmentList;
        tempShipmentList[index].OrderQuantity = result.OrderQuantity;
        tempShipmentList[index].TotalFOB = result.FOB * result.OrderQuantity;
        setExportInvoice((pre) => {
          return {
            ...pre,
            ShipmentList: tempShipmentList,
          };
        });
      })
      .catch((err) => console.log(err));
  };

  const headers = [
    { label: "LC No", key: "JobID" },
    { label: "BL", key: "BL" },
    { label: "InvoiceNo", key: "InvoiceNo" },
    { label: "Invoice Date", key: "Invoice Date" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Export Invoice">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setShowIsRequiredMsg(false);
            setCanvasBody("add");
            setSelectedItemID(undefined);
            setExportInvoice({
              CATNo: "347",
              ShipmentList: [],
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
          filename="ExportInvoice"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <LC
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                jobId: value ? value.value : null,
              });
            }}
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Invoice
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                invoiceId: value ? value.value : null,
              });
            }}
          />
        </Form.Group>
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
            />
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive size="sm" hover striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job No</th>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Invoice Quantity</th>
                    <th>Invoice Value</th>
                    <th>Exp</th>
                    <th>On Board Date</th>
                    <th>BL</th>
                    <th>BL Date</th>
                    <th>FDBP No</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {response.data?.map((item, index) => (
                    <tr
                      onClick={() => setSelectedItemID(item.InvoiceId)}
                      key={index}
                      className={
                        item.InvoiceId === selectedItemID ? "table-active" : ""
                      }
                    >
                      <td>
                        {index +
                          searchCriteria.pageIndex * searchCriteria.pageSize +
                          1}
                      </td>
                      <td>{item.JobNo}</td>
                      <td>{item.InvoiceNo}</td>
                      <td>{item.InvoiceDate}</td>
                      <td>{item?.InvoiceQuantity}</td>
                      <td>{item?.InvoiceValue}</td>
                      <td>{item?.EXP}</td>
                      <td>{item?.OnBoardDate}</td>
                      <td>{item?.BL}</td>
                      <td>{item?.BLRealeaseDate}</td>
                      <td>{item?.FDBP_No}</td>
                      <td className="d-flex">
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setCanvasBody("add");
                            getExportInvoiceById(item.InvoiceId);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-success ms-1"
                          onClick={() => {
                            setShowCanvas(true);
                            setCanvasBody("invoice");
                            getExportInvoiceById(item.InvoiceId);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-file-lines" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-danger ms-1"
                          onClick={() => setShowDialog(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="float-end">
                <Pagination.Prev
                  onClick={() =>
                    setSearchCriteria({
                      ...searchCriteria,

                      pageIndex:
                        searchCriteria.pageIndex === 0
                          ? 0
                          : searchCriteria.pageIndex - 1,
                    })
                  }
                  disabled={searchCriteria.pageIndex === 0}
                />

                <Pagination.Next
                  onClick={() =>
                    setSearchCriteria({
                      ...searchCriteria,

                      pageIndex: searchCriteria.pageIndex + 1,
                    })
                  }
                />
              </Pagination>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-100"
        scroll={false}
        backdrop={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Export Invoice</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {canvasBody === "add" && (
            <Form
              noValidate
              validated={validated}
              onSubmit={saveExportInvoice}
              method="POST"
            >
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Job No
                </Form.Label>
                <Col sm="6">
                  <LC
                    onChange={(value, action) => {
                      setExportInvoice({
                        ...exportInvoice,
                        [action.name]: value ? value.value : null,
                      });
                    }}
                    name="JobID"
                    selected={exportInvoice.JobID}
                    isRequired={showIsRequiredMsg}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">
                  Invoice No
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="InvoiceNo"
                    value={exportInvoice.InvoiceNo}
                    required
                  />
                </Col>
                <Form.Label column sm="2">
                  Invoice Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="InvoiceDate"
                    value={exportInvoice.InvoiceDate}
                    required
                  />
                </Col>
                <Form.Label column sm="2">
                  Sight Days
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="number"
                    name="SightDays"
                    value={exportInvoice.SightDays}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">
                  Ex Factory Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="ExFactoryDate"
                    value={exportInvoice.ExFactoryDate}
                  />
                </Col>

                <Form.Label column sm="2">
                  Exp
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="EXP"
                    value={exportInvoice.EXP}
                  />
                </Col>

                <Form.Label column sm="2">
                  Exp Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="EXPDate"
                    value={exportInvoice.EXPDate}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">
                  On Board Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="OnBoardDate"
                    value={exportInvoice.OnBoardDate}
                  />
                </Col>

                <Form.Label column sm="2">
                  Shipping Bill
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="ShippingBill"
                    value={exportInvoice.ShippingBill}
                  />
                </Col>

                <Form.Label column sm="2">
                  Shipping Bill Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="ShippingBillDate"
                    value={exportInvoice.ShippingBillDate}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">
                  BL
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="BL"
                    value={exportInvoice.BL}
                  />
                </Col>

                <Form.Label column sm="2">
                  B/L Realese Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="BLRealeaseDate"
                    value={exportInvoice.BLRealeaseDate}
                  />
                </Col>

                <Form.Label column sm="2">
                  BL To Be Endorsed To
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="BLToBeEndorsedTo"
                    value={exportInvoice.BLToBeEndorsedTo}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">
                  DOC Dispatch Date
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="date"
                    name="DocDespatchDate"
                    value={exportInvoice.DocDespatchDate}
                  />
                </Col>

                <Form.Label column sm="2">
                  Pass Book No
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="PassBookNo"
                    value={exportInvoice.PassBookNo}
                  />
                </Col>

                <Form.Label column sm="2">
                  Custom Hs Code
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="CustomHSCode"
                    value={exportInvoice.CustomHSCode}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mt-2">
                <Form.Label column sm="2">
                  Country Name
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="CountryName"
                    value={exportInvoice.CountryName}
                  />
                </Col>

                <Form.Label column sm="2">
                  Port Of Loading
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="PortOfLoading"
                    value={exportInvoice.PortOfLoading}
                  />
                </Col>

                <Form.Label column sm="2">
                  Final Destination
                </Form.Label>
                <Col>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="FinalDestination"
                    value={exportInvoice.FinalDestination}
                  />
                </Col>
              </Form.Group>

              <Row className="mt-2">
                <Form.Group as={Col}>
                  <Form.Label>For Account & Risk Messers</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    as="textarea"
                    name="ForAccountandMessers"
                    value={exportInvoice.ForAccountandMessers}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Notify Party</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    as="textarea"
                    name="NotifyParty"
                    value={exportInvoice.NotifyParty}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>3rd Notify Party</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="ThirdNotifyParty"
                    as="textarea"
                    value={exportInvoice.ThirdNotifyParty}
                  />
                </Form.Group>
              </Row>

              <Row className="mt-2">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th className="col-3">PO No</th>

                      <th>Order Quantity</th>
                      <th>Shipment Qty</th>
                      <th>CTN Qty</th>
                      <th>Gross Weight</th>
                      <th>Net Weight</th>
                      <th>Total FOB</th>
                      <th>Invoice FOB</th>
                      <th>Challan Date</th>
                      <th>
                        <Button variant="outline-primary" onClick={addRowClick}>
                          <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exportInvoice?.ShipmentList?.map((x, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <SalesOrder
                              onChange={(value) => {
                                x.PurchaseOrderID = value ? value.value : null;
                                getPoById(value ? value.value : null, i);
                              }}
                              name="PurchaseOrderID"
                              selected={x.PurchaseOrderID}
                              selectedPO={x.PONo}
                              isRequired={showIsRequiredMsg}
                            />
                          </td>
                          <td>{x.OrderQuantity?.toLocaleString()}</td>
                          <td>
                            <Form.Control
                              onChange={(e) => handleShipmentListChange(e, i)}
                              type="number"
                              name="ChalanQuantity"
                              value={x.ChalanQuantity}
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              onChange={(e) => handleShipmentListChange(e, i)}
                              type="number"
                              name="CartoonQuantity"
                              value={x.CartoonQuantity}
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              onChange={(e) => handleShipmentListChange(e, i)}
                              type="number"
                              name="GrossWeight"
                              value={x.GrossWeight}
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              onChange={(e) => handleShipmentListChange(e, i)}
                              type="number"
                              name="NetWeight"
                              value={x.NetWeight}
                              required
                            />
                          </td>
                          <td>
                            {x.TotalFOB?.toLocaleString("eng", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td>
                            <Form.Control
                              onChange={(e) => handleShipmentListChange(e, i)}
                              type="number"
                              name="InvoiceFOB"
                              value={x.InvoiceFOB}
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              onChange={(e) => handleShipmentListChange(e, i)}
                              type="date"
                              name="ChalanDate"
                              value={x.ChalanDate}
                              required
                            />
                          </td>

                          <td className="d-flex">
                            <Button
                              variant="outline-danger"
                              onClick={() => removeInputRowClick(i)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="fw-bold">
                      <td colSpan={2}>Total</td>
                      <td>
                        {exportInvoice?.ShipmentList?.reduce((tot, it) => {
                          if (it.ChalanQuantity) {
                            tot += Number(it.ChalanQuantity);
                          }
                          return tot;
                        }, 0)?.toLocaleString("eng", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan={4}></td>
                      <td>
                        {exportInvoice?.ShipmentList?.reduce((tot, it) => {
                          if (it.InvoiceFOB) {
                            tot += Number(it.InvoiceFOB);
                          }
                          return tot;
                        }, 0)?.toLocaleString("eng", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </Table>
              </Row>

              <Button variant="light" onClick={handleReset}>
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
                  {exportInvoice.InvoiceId ? "Update" : "Save"}
                </Button>
              )}
            </Form>
          )}
          {canvasBody === "invoice" && (
            <CommercialInvoice exportInvoice={exportInvoice} />
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteExportInvoice}
      />
    </Fragment>
  );
};

export default ExportInvoice;
