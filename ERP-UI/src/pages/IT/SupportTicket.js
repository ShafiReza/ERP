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
} from "react-bootstrap";

import { useState, Fragment, createRef, useCallback, useEffect } from "react";
import { IssueType } from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const SupportTicket = () => {
  const [supportTicket, setSupportTicket] = useState({});
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    assignTo: "",
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};

  const getAllSupportTicket = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("SupportTicket?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllSupportTicket();
  }, [getAllSupportTicket]);

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
    setSupportTicket({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSupportTicket({ ...supportTicket, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveSupportTicket = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = supportTicket.ID ? "PUT" : "POST";
    supportTicket.AssignTo = user?.userName;
    saveData("SupportTicket", methodType, supportTicket, getAllSupportTicket);
  };

  const deleteSupportTicket = () => {
    deleteData(
      "/" + supportTicket.ConsumptionUnitID,
      "DELETE",
      null,
      getAllSupportTicket
    );
  };

  const headers = [
    { label: "Token No", key: "TokenNo" },
    { label: "Issue Type", key: "IssueType" },
    { label: "Details", key: "Details" },
    { label: "CreatedBy", key: "CreatedBy" },
    { label: "Assign To", key: "AssignTo" },
    { label: "Created Date", key: "CreatedDate" },
    { label: "Due Date", key: "DueDate" },
    { label: "Completed Date", key: "CompletedDate" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Support Ticket">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setSupportTicket({});
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
          filename="Support Ticket"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col>
          <Row>
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
                  name="fromDate"
                  value={searchCriteria.fromDate}
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
                  name="toDate"
                  value={searchCriteria.toDate}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <Form.Control
                name="assignTo"
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    assignTo: e.target.value,
                  })
                }
                value={searchCriteria.assignTo}
                placeholder="Asign To"
              />
            </Form.Group>
          </Row>
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
                    <th>Token No</th>
                    <th>Issue Type</th>
                    <th>Details</th>
                    <th>Created By</th>
                    <th>Assign To</th>
                    <th>Created Date</th>
                    <th>Due Date</th>
                    <th>CompletedDate</th>
                    <th></th>
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
                        setSupportTicket(item);
                      }}
                      key={item.ID}
                      className={
                        item.ID === supportTicket.ID ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.TokenNo}</td>
                      <td>{item.IssueType}</td>
                      <td>{item.Details}</td>
                      <td>{item.CreatedBy}</td>
                      <td>{item.AssignTo}</td>
                      <td>{item.CreatedDate}</td>
                      <td>{item.DueDate}</td>
                      <td>{item.CompletedDate}</td>
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
          <Offcanvas.Title>Support Ticket</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveSupportTicket}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Token No</Form.Label>
                    <Form.Control value={supportTicket.TokenNo} readOnly />
                  </Form.Group>
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Issue Type</Form.Label>
                    <IssueType
                      onChange={(value) =>
                        setSupportTicket({
                          ...supportTicket,
                          IssueType: value ? value.value : null,
                        })
                      }
                      selected={supportTicket.IssueType}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="DueDate"
                      type="date"
                      value={supportTicket.DueDate}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Completed Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="CompletedDate"
                      type="date"
                      value={supportTicket.CompletedDate}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      onChange={(e) => handleChange(e)}
                      name="Details"
                      value={supportTicket.Details}
                    />
                  </Form.Group>
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
                    {supportTicket.ID ? "Update" : "Save"}
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
        handleDialogYes={deleteSupportTicket}
      />
    </Fragment>
  );
};

export default SupportTicket;
