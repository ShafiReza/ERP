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

import { useState, Fragment, createRef, useCallback, useEffect } from "react";
import { BackToBackLC } from "../../../src/components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const BackToBackLCPayment = () => {
  const [backtobacklcpayment, setBacktobacklcpayment] = useState({});
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();
  const [bl, getBl] = useFetch();

  const getAllBacktobacklcpayment = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData(
      "BackToBackLCPayment?" + new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllBacktobacklcpayment();
  }, [getAllBacktobacklcpayment]);

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
      (input) => (input.value = "")
    );
    setBacktobacklcpayment({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setBacktobacklcpayment({ ...backtobacklcpayment, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveBacktobacklcpayment = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = backtobacklcpayment.BackToBackLCPaymentID
      ? "PUT"
      : "POST";
    saveData(
      "BackToBackLCPayment",
      methodType,
      backtobacklcpayment,
      getAllBacktobacklcpayment
    );
  };

  const deleteBacktobacklcpayment = () => {
    deleteData(
      "/" + backtobacklcpayment.ConsumptionUnitID,
      "DELETE",
      null,
      getAllBacktobacklcpayment
    );
  };

  const getBlByb2b = (id) => {
    if (id !== null) {
      getBl("ImportInvoice?" + new URLSearchParams({ b2bLCId: id }), "GET");
    }
  };

  const headers = [{ label: "Unit Name", key: "ConsumptionUnitName" }];

  return (
    <Fragment>
      <Actionbar pageTitle="BackToBackLC Payment">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setBacktobacklcpayment({});
            getBlByb2b(0);
          }}
          className="nav-link text-primary"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="Unit"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <BackToBackLC
              onChange={(value) => {
                setSearchCriteria({
                  ...searchCriteria,
                  backtobacklcid: value ? value.value : null,
                });
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Back to Back LC No</th>
                    <th>Back to Back LC Value</th>
                    <th>Payment Amount</th>
                    <th>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="9" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        setBacktobacklcpayment(item);
                      }}
                      key={item.BackToBackLCPaymentID}
                      className={
                        item.BackToBackLCPaymentID ===
                        backtobacklcpayment.BackToBackLCPaymentID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.BackToBackLCNo}</td>
                      <td>{item.BackToBackLCValue}</td>
                      <td>{item.PaymentValue}</td>
                      <td>{item.PaymentDate}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setShowCanvas(true);
                            getBlByb2b(item.BackToBackLCID);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
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
        className="w-50"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Back to Back LC Payment</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveBacktobacklcpayment}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm="6">
                    <Form.Label>BackToBackLC</Form.Label>
                    <BackToBackLC
                      onChange={(value) => {
                        setBacktobacklcpayment({
                          ...backtobacklcpayment,
                          BackToBackLCID: value ? value.value : null,
                        });
                        getBlByb2b(value.value);
                      }}
                      selected={backtobacklcpayment.BackToBackLCNo}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Payment Amount</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="PaymentValue"
                      type="number"
                      value={backtobacklcpayment.PaymentValue}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Payment Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="PaymentDate"
                      type="date"
                      value={backtobacklcpayment.PaymentDate}
                    />
                  </Form.Group>
                </Row>
                <Row className="mt-3">
                  <Table responsive hover striped size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>BL No</th>
                        <th>Maturity Date</th>
                        <th>Acceptance Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bl.dataLoading && (
                        <tr>
                          <td colSpan="9" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!bl.dataLoading && bl.data.length === 0 && (
                        <tr>
                          <td colSpan="9" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {bl.data.map((item, index) => (
                        <tr key={item.BLID}>
                          <td>{index + 1}</td>
                          <td>{item.BLNo}</td>
                          <td>{item.MaturityDate}</td>
                          <td>{item.AcceptanceValue}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="fw-bold text-end">
                          Total:
                        </td>
                        <td>
                          {bl.data
                            ?.reduce(
                              (total, item) => (total += item.AcceptanceValue),
                              0
                            )
                            .toFixed(3)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>

                <Button
                  variant="light"
                  onClick={handleReset}
                  type="cancel"
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
                    {backtobacklcpayment.BackToBackLCPaymentID
                      ? "Update"
                      : "Save"}
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
        handleDialogYes={deleteBacktobacklcpayment}
      />
    </Fragment>
  );
};

export default BackToBackLCPayment;
