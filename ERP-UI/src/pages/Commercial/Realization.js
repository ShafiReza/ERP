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
  Pagination,
  Offcanvas,
  Nav,
  InputGroup,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import { FDBP } from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const Realization = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [realization, setRealization] = useState({});
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [localSearchCriteria, setLocalSearchCriteria] = useState({});
  const [itemExportList, setItemExportList] = useState([]);

  const [response, getData] = useFetch();
  const [bankForwarding, getBankForwarding] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllRealization = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Realization?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllRealization();
  }, [getAllRealization]);

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

  const preview = () => {
    setSearchCriteria({ ...searchCriteria, ...localSearchCriteria });
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setRealization({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRealization({ ...realization, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const getBankForwardingByID = (id) => {
    if (id !== null) {
      getBankForwarding("BankForwarding/" + id, "GET");
    }
  };

  const handleRowClick = (item) => {
    setRealization(item);
    getBankForwardingByID(item.BankForwardingID);
  };

  const saveRealization = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = realization.RealizationID ? "PUT" : "POST";
    saveData("Realization", methodType, realization, getAllRealization);
  };

  const deleteRealization = () => {
    deleteData(
      "Realization/" + realization.RealizationID,
      "DELETE",
      null,
      getAllRealization
    );
  };

  const headers = [
    { label: "FDBPNo", key: "FDBPNo" },
    { label: "Realization Date", key: "RealizationDate" },
    { label: "CurrencyRate", key: "CurrencyRate" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Realization">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setRealization({});
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
          filename="Realization"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <FDBP
            onChange={(value) => {
              setLocalSearchCriteria({
                ...localSearchCriteria,
                bankforwardingId: value ? value.value : null,
              });
            }}
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <InputGroup>
            <InputGroup.Text>From</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setLocalSearchCriteria({
                  ...localSearchCriteria,
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
                setLocalSearchCriteria({
                  ...localSearchCriteria,
                  toDate: e.target.value,
                })
              }
              type="date"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Button onClick={preview}>Preview</Button>
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>FDBP No</th>
                    <th>Realized Value</th>
                    <th>Realization Date</th>
                    <th>Currency Rate</th>
                    <th>PRC Value</th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="14" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="14" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {(response.data || []).map((item, index) => (
                    <tr
                      onClick={() => {
                        handleRowClick(item);
                      }}
                      key={item.RealizationID}
                      className={
                        item.RealizationID === realization.RealizationID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.FDBPNo}</td>
                      <td>{item.RealizedValue}</td>
                      <td>{item.RealizationDate}</td>
                      <td>{item.CurrencyRate}</td>
                      <td>{item.PrcValue}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
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
                  <tr className="fw-bold">
                    <td colSpan={2}>Total</td>
                    <td>
                      {response.data
                        ?.reduce((tot, it) => (tot += it.RealizedValue), 0)
                        ?.toLocaleString("eng", {
                          minimumFractionDigits: 2,
                        })}
                    </td>
                    <td colSpan={4}></td>
                  </tr>
                </tbody>
              </Table>
              <Pagination className="float-end">
                <Pagination.Prev
                  onClick={() =>
                    setSearchCriteria({
                      ...searchCriteria,

                      pageIndex:
                        searchCriteria.pageIndex === 1
                          ? 1
                          : searchCriteria.pageIndex - 1,
                    })
                  }
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
        className="w-50"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Realization</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveRealization}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm="6">
                    <Form.Label>FDBP No</Form.Label>
                    <FDBP
                      onChange={(value, action) => {
                        setRealization({
                          ...realization,
                          [action.name]: value ? value.value : null,
                        });
                        getBankForwardingByID(value ? value.value : null);
                      }}
                      name="BankForwardingID"
                      selected={realization.BankForwardingID}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Invoice Value</Form.Label>
                    <Form.Control
                      value={bankForwarding?.data?.InvoiceList?.reduce(
                        (total, item) => {
                          return (total += item.InvoiceValue ?? 0);
                        },
                        0
                      )}
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Realized Value</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="RealizedValue"
                      value={realization.RealizedValue}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Realization Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="RealizationDate"
                      value={realization.RealizationDate}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Currency Rate</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="CurrencyRate"
                      value={realization.CurrencyRate}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>PRC Value</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="PrcValue"
                      value={realization.PrcValue}
                      required
                    />
                  </Form.Group>
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
                    {realization.RealizationID ? "Update" : "Save"}
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
        handleDialogYes={deleteRealization}
      />
    </Fragment>
  );
};

export default Realization;
