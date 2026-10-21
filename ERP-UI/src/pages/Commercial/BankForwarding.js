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
import ConfirmDialog from "../../components/ConfirmDialog";
import { LC, Invoice, BankForwardingNo } from "../../components/DropDown";
import { CSVLink } from "react-csv";
import BankForwardingReport from "../../components/commercial/BankForwardingReport";
const csvLink = createRef();

const BankForwarding = () => {
  const [selectedItemID, setSelectedItemID] = useState(undefined);
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [bankForwarding, setBankForwarding] = useState({
    InvoiceList: [],
  });
  const [reportProps, setReportProps] = useState({});
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllBankForwarding = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("BankForwarding?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllBankForwarding();
  }, [getAllBankForwarding]);

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

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setBankForwarding({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBankForwarding({ ...bankForwarding, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const removeInvoiceClick = (index) => {
    const list = [...bankForwarding.InvoiceList];
    list.splice(index, 1);
    setBankForwarding((pre) => {
      return {
        ...pre,
        InvoiceList: list,
      };
    });
  };

  const saveBankForwarding = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = bankForwarding.BankForwardingID ? "PUT" : "POST";
    saveData(
      "BankForwarding",
      methodType,
      bankForwarding,
      getAllBankForwarding
    );
  };

  const deleteBankForwarding = () => {
    deleteData(
      "BankForwarding/" + bankForwarding.BankForwardingID,
      "DELETE",
      null,
      getAllBankForwarding
    );
  };

  const getBankForwardingById = (BankForwardingID) => {
    fetch(
      process.env.REACT_APP_API_URL + "BankForwarding/" + BankForwardingID,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setBankForwarding(result);
        setShowCanvas(true);
        setCanvasBody("add");
      })
      .catch((err) => console.log(err));
  };

  const headers = [
    { label: "BankForwarding No", key: "BankForwardingNo" },
    { label: "BankForwarding Date", key: "BankForwardingDate" },
    { label: "FDBPNo", key: "FDBPNo" },
    { label: "Courier", key: "Courier" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Bank Forwarding">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setCanvasBody("add");
            setBankForwarding({ InvoiceList: [] });
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
          filename="BankForwarding"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <LC
              onChange={(value, action) =>
                setSearchCriteria({
                  ...searchCriteria,
                  [action.name]: value ? value.value : null,
                })
              }
              name="jobId"
              placeholder="LC No"
            />
          </Form.Group>
        </Col>
        <Col sm="3">
          <Form.Group>
            <BankForwardingNo
              onChange={(value, action) =>
                setSearchCriteria({
                  ...searchCriteria,
                  [action.name]: value ? value.value : null,
                })
              }
              name="bankforwardingId"
              placeholder="Bank Forwarding No"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Job No</th>
                    <th>Bank Forwarding No</th>
                    <th>Bank Forwarding Date</th>
                    <th>FDBP No</th>
                    <th>Courier No</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {response.data?.map((item, index) => (
                    <tr
                      onClick={() => setSelectedItemID(item.BankForwardingID)}
                      key={item.BankForwardingID}
                      className={
                        item.BankForwardingID === selectedItemID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.JobNo}</td>
                      <td>{item.BankForwardingNo}</td>
                      <td>{item.BankForwardingDate}</td>
                      <td>{item.FDBPNo}</td>
                      <td>{item.Courier}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            getBankForwardingById(item.BankForwardingID)
                          }
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-success ms-1"
                          onClick={() => {
                            setShowCanvas(true);
                            setCanvasBody("report");
                            setReportProps({
                              bankForwardingID: item.BankForwardingID,
                              bankID: item.BankID,
                            });
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-75"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Bank Forwarding</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              {canvasBody === "add" && (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveBankForwarding}
                  method="POST"
                >
                  <Row>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label>Job No</Form.Label>
                        <LC
                          onChange={(value, action) => {
                            setBankForwarding({
                              ...bankForwarding,
                              [action.name]: value ? value.value : null,
                            });
                          }}
                          name="JobID"
                          selected={bankForwarding.JobID}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Bank Forwarding No</Form.Label>
                        <Form.Control
                          value={bankForwarding.BankForwardingNo}
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Bank Forwarding Date</Form.Label>
                        <Form.Control
                          onChange={(e) => handleChange(e)}
                          type="date"
                          name="BankForwardingDate"
                          value={bankForwarding.BankForwardingDate}
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>FDBP No</Form.Label>
                        <Form.Control
                          onChange={(e) => handleChange(e)}
                          type="text"
                          name="FDBPNo"
                          value={bankForwarding.FDBPNo}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Courier No</Form.Label>
                        <Form.Control
                          onChange={(e) => handleChange(e)}
                          name="Courier"
                          value={bankForwarding.Courier}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label>Invoice No</Form.Label>
                        <Invoice
                          onChange={(value) => {
                            if (value) {
                              setBankForwarding((pre) => {
                                return {
                                  ...pre,
                                  InvoiceList: [
                                    ...pre.InvoiceList,
                                    {
                                      InvoiceNo: value.label,
                                      InvoiceID: value.value,
                                    },
                                  ],
                                };
                              });
                            }
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Table responsive hover size="sm" striped>
                          <thead>
                            <tr>
                              <th>Invoice No</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody>
                            {(bankForwarding?.InvoiceList).map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td>{item.InvoiceNo}</td>
                                  <td>
                                    <Button
                                      variant="btn btn-sm btn-outline-danger"
                                      onClick={(e) => removeInvoiceClick(i)}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="light" onClick={handleReset}>
                    Reset
                  </Button>
                  {reqResponse.loading ? (
                    <Button
                      variant="primary"
                      disabled
                      className="float-end mt-2"
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
                      className="float-end mt-2"
                    >
                      {bankForwarding.BankForwardingID ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              )}
              {canvasBody === "report" && (
                <BankForwardingReport bankForwarding={reportProps} />
              )}
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteBankForwarding}
      />
    </Fragment>
  );
};

export default BankForwarding;
