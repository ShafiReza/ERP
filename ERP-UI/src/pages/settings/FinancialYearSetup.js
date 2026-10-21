import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Table,
  Nav,
  Offcanvas,
} from "react-bootstrap";

import { useState, createRef, Fragment, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const FinancialYearSetup = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [financialYear, setFinancialYear] = useState({});
  const [validated, setValidated] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const {
    yearStartDate,
    yearEndDate,
    transactionId,
    bookClosingAccount,
    bookClosingAmount,
  } = financialYear;

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllFinancialYear = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("FinancialYear?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllFinancialYear();
  }, [getAllFinancialYear]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setFinancialYear({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFinancialYear({ ...financialYear, [name]: value });
  };

  const handleRowClick = (item) => {
    setFinancialYear(item);
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveFinancialYear = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = financialYear.id ? "PUT" : "POST";
    saveData("FinancialYear", methodType, financialYear, getAllFinancialYear);
  };

  const deleteFinancialYear = () => {
    deleteData(
      "FinancialYear/" + financialYear.id,
      "DELETE",
      null,
      getAllFinancialYear
    );
  };

  const headers = [
    { label: "Year Start Date", key: "yearStartDate" },
    { label: "Year End Date", key: "yearEndDate" },
    { label: "Transaction Id", key: "transactionId" },
    { label: "Book Closing Account", key: "bookClosingAccount" },
    { label: "Book Closing Amount", key: "bookClosingAmount" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Financial Year">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setFinancialYear({});
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
          filename="ItemList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <Form.Control
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  Account: e.target.value,
                })
              }
              placeholder="Search"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Year Start Date</th>
                    <th>Year End date</th>
                    <th>Transaction</th>
                    <th>Book Closing Account</th>
                    <th>Book Closing Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        handleRowClick(item);
                      }}
                      key={item.id}
                      className={
                        item.id === financialYear.id ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.yearStartDate}</td>
                      <td>{item.yearEndDate}</td>
                      <td>{item.transactionId}</td>
                      <td>{item.bookClosingAccount}</td>
                      <td>{item.bookClosingAmount}</td>
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
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-50"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Financial Year Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveFinancialYear}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Year Start Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="yearStartDate"
                      value={yearStartDate}
                      required
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Year End Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="yearEndDate"
                      value={yearEndDate}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Transaction</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="transactionId"
                      value={transactionId}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Book Closing Account</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="bookClosingAccount"
                      value={bookClosingAccount}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Book Closing Amount</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="bookClosingAmount"
                      value={bookClosingAmount}
                    />
                  </Form.Group>
                </Row>

                <Button
                  variant="light"
                  onClick={handleReset}
                  type="cancel"
                  as={Col}
                >
                  Reset
                </Button>
                {reqResponse.loading ? (
                  <Button variant="primary" disabled className="float-end">
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
                  <Button variant="primary" type="submit" className="float-end">
                    {financialYear.id ? "Update" : "Save"}
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
        handleDialogYes={deleteFinancialYear}
      />
    </Fragment>
  );
};

export default FinancialYearSetup;
