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
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import { LC, BackToBackLC, Port, BL } from "../../components/DropDown";
import ConfirmDialog from "../../components/ConfirmDialog";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const BillOfLading = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [importInvoice, setImportInvoice] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [localSearchCriteria, setLocalSearchCriteria] = useState(null);
  const [itemExportList, setItemExportList] = useState([]);

  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();
  const [backToback, getBackToBack] = useFetch();

  const getAllInvoice = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("ImportInvoice?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllInvoice();
  }, [getAllInvoice]);

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
  };

  useEffect(() => {
    if (localSearchCriteria !== null) {
      const timer = setTimeout(() => {
        setSearchCriteria(localSearchCriteria);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [localSearchCriteria]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // setImportInvoice({ ...importInvoice, [name]: value });
    setImportInvoice((pre) => {
      return { ...pre, [name]: value };
    });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveImportInvoice = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = importInvoice.BLID ? "PUT" : "POST";
    saveData("ImportInvoice", methodType, importInvoice, getAllInvoice);
  };

  const deleteBillOfLading = () => {
    deleteData(
      "ImportInvoice/" + importInvoice.BLID,
      "DELETE",
      null,
      getAllInvoice
    );
  };

  const getBackToBackLcById = (id) => {
    getBackToBack("BackToBackLC/" + id, "GET");
  };

  const headers = [
    { label: "LC No", key: "BackToBackLCNo" },
    { label: "BL No", key: "BLNo" },
    { label: "InvoiceNo", key: "InvoiceNo" },
    { label: "Invoice Date", key: "InvoiceDate" },
  ];

  useEffect(() => {
    if (importInvoice.BLDate && backToback.data.SightDays) {
      const date = new Date(importInvoice.BLDate);
      date.setDate(date.getDate() + backToback.data.SightDays);

      setImportInvoice((pre) => {
        return { ...pre, MaturityDate: date.toISOString().split("T")[0] };
      });
    }
  }, [importInvoice.BLDate, backToback.data.SightDays]);

  return (
    <Fragment>
      <Actionbar pageTitle="Bill of Lading">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setImportInvoice({});
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
          filename="ImportInvoice"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col>
          <LC
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                jobId: value ? value.value : null,
              });
            }}
          />
        </Col>
        <Col>
          <BackToBackLC
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                b2bLCId: value ? value.value : null,
              });
            }}
          />
        </Col>
        <Col>
          <BL
            onChange={(value) =>
              setSearchCriteria({
                ...searchCriteria,
                blId: value ? value.value : null,
              })
            }
          />
        </Col>
        <Col>
          <Form.Control
            type="text"
            onChange={(e) =>
              setLocalSearchCriteria({
                ...localSearchCriteria,
                invoiceNo: e.target.value,
              })
            }
            placeholder="Invoice No"
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>BL No</th>
                    <th>BL Date</th>
                    <th>B2B LC No</th>
                    <th>Maturity Date</th>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Acceptance Value</th>
                    <th>Passbook No</th>
                    <th>Port</th>
                    <th>BoE No</th>
                    <th>BoE Date</th>
                    <th>BoE Desc.</th>
                    <th>Job No</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="16" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="16" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {response.data?.map((item, index) => (
                    <tr
                      onClick={() => {
                        setImportInvoice(item);
                      }}
                      key={item.BLID}
                      className={
                        item.BLID === importInvoice.BLID ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item?.BLNo}</td>
                      <td>{item?.BLDate}</td>
                      <td>{item?.BackToBackLCNo}</td>
                      <td>{item?.MaturityDate}</td>
                      <td>{item?.InvoiceNo}</td>
                      <td>{item?.InvoiceDate}</td>
                      <td>{item?.AcceptanceValue}</td>
                      <td>{item?.PassBookNo}</td>
                      <td>{item?.Port}</td>
                      <td>{item?.BillEntryNo}</td>
                      <td>{item?.BillEntryDate}</td>
                      <td>{item?.BillEntryDsc}</td>
                      <td>{item?.JobNo}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-danger ms-1"
                          type=""
                          onClick={() => setShowDialog(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                        </Button>
                      </td>
                    </tr>
                  ))}
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
        className="w-50"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Import Invoice(BL)</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveImportInvoice}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>B2B LC</Form.Label>
                    <BackToBackLC
                      onChange={(value, action) => {
                        setImportInvoice({
                          ...importInvoice,
                          [action.name]: value ? value.value : null,
                        });
                        getBackToBackLcById(value ? value.value : null);
                      }}
                      name="BackToBackLCID"
                      selected={importInvoice.BackToBackLCNo}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>BL No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      required
                      name="BLNo"
                      value={importInvoice.BLNo}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>BL Date</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      required
                      type="date"
                      name="BLDate"
                      value={importInvoice.BLDate}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Maturity Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={importInvoice.MaturityDate}
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Invoice No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="InvoiceNo"
                      value={importInvoice.InvoiceNo}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Invoice Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="InvoiceDate"
                      value={importInvoice.InvoiceDate}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Original Document Received Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="OriginalDocumentReceivedDate"
                      value={importInvoice.OriginalDocumentReceivedDate}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Copy Document Received Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="CopyDocumentReceivedDate"
                      value={importInvoice.CopyDocumentReceivedDate}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Goods Delivery Date By CNF</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="GoodsDeliveryDateByCNF"
                      value={importInvoice.GoodsDeliveryDateByCNF}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Document Sent To CNF</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="DocumentSentToCNF"
                      value={importInvoice.DocumentSentToCNF}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Acceptance Value</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="AcceptanceValue"
                      value={importInvoice.AcceptanceValue}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Goods In House Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="GoodsInHouseDate"
                      value={importInvoice.GoodsInHouseDate}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Port</Form.Label>
                    <Port
                      onChange={(value, action) => {
                        setImportInvoice({
                          ...importInvoice,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="Port"
                      selected={importInvoice.Port}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm="6">
                    <Form.Label>Passbook No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="PassBookNo"
                      value={importInvoice.PassBookNo}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Bill of Entry No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="BillEntryNo"
                      value={importInvoice.BillEntryNo}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Bill of Entry Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="BillEntryDate"
                      value={importInvoice.BillEntryDate}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col}>
                    <Form.Label>Bill of Entry Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => handleChange(e)}
                      name="BillEntryDsc"
                      value={importInvoice.BillEntryDsc}
                    />
                  </Form.Group>
                </Row>

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
                    {importInvoice.BLID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteBillOfLading}
      />
    </Fragment>
  );
};

export default BillOfLading;
