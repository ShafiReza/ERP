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
  Badge,
  Dropdown,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import { CSVLink } from "react-csv";
import { Bank, LC, Buyer, Company } from "../../components/DropDown";
import ContractPaper from "../../components/commercial/ContractPaper";
import JobStatus from "../../components/commercial/JobStatus";
const csvLink = createRef();

const LcSetup = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [job, setJob] = useState({});
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllLc = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Job?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllLc();
  }, [getAllLc]);

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setJob({});
  };

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(response.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJob({ ...job, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const handleRowClick = (item) => {
    setJob(item);
  };

  const saveLc = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = job.JobId ? "PUT" : "POST";

    saveData("Job", methodType, job, getAllLc);
  };

  const deleteLc = () => {
    deleteData("Job/" + job.JobId, "DELETE", null, getAllLc);
  };

  const headers = [
    { label: "Job No", key: "JobNo" },
    { label: "Contract No", key: "ContractNo" },
    { label: "Contract Date", key: "ContractDate" },
    { label: "Bank", key: "BankName" },
    { label: "UD No", key: "UDNo" },
    { label: "UD Date", key: "UDDate" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Job">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setCanvasBody("add");
            setJob({});
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
          filename="JobList"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <LC
            onChange={(value) =>
              setSearchCriteria({
                ...searchCriteria,
                jobId: value ? value.value : null,
              })
            }
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Job No</th>
                    <th className="col-2">Contract No</th>
                    <th>Contract Date</th>
                    <th>Bank</th>
                    <th>UD No</th>
                    <th>UD Date</th>
                    <th>Status</th>
                    <th className="col-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {response.data?.map((item, index) => (
                    <tr
                      onClick={() => {
                        handleRowClick(item);
                      }}
                      key={item.JobId}
                      className={item.JobId === job.JobId ? "table-active" : ""}
                    >
                      <td>{item.JobNo}</td>
                      <td>{item.ContractNo}</td>
                      <td>{item?.ContractDate}</td>
                      <td>{item?.BankName}</td>
                      <td>{item.UDNo}</td>
                      <td>{item?.UDDate}</td>
                      <td>
                        {item.IsClosed ? (
                          <Badge pill bg="danger">
                            Close
                          </Badge>
                        ) : (
                          <Badge pill bg="primary">
                            Open
                          </Badge>
                        )}
                      </td>
                      <td className="d-flex">
                        <Button
                          variant="btn btn-sm btn-outline-primary ms-1"
                          onClick={() => {
                            setCanvasBody("add");
                            setShowCanvas(true);
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
                                setCanvasBody("contract");
                                setShowCanvas(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Contract Paper
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom"
                              onClick={() => {
                                setCanvasBody("jobstatus");
                                setShowCanvas(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Job Budget
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="border-bottom"
                              onClick={() => setShowDialog(true)}
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Delete LC
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
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
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {canvasBody === "add"
              ? "LC/Contract/Job"
              : canvasBody === "jobstatus"
              ? "Job Budget"
              : "Contract Paper"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              {canvasBody === "add" && (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveLc}
                  method="POST"
                >
                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>Contract No</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        name="ContractNo"
                        value={job.ContractNo}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Contract Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="date"
                        name="ContractDate"
                        value={job.ContractDate}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>Job No</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="JobNo"
                        value={job.JobNo}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Bank</Form.Label>
                      <Bank
                        onChange={(value, action) => {
                          setJob({
                            ...job,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="BankID"
                        selected={job.BankID}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>UD No</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        name="UDNo"
                        value={job.UDNo}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>UD Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="date"
                        name="UDDate"
                        value={job.UDDate}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-2">
                    <Form.Group as={Col}>
                      <Form.Label>Buyer</Form.Label>
                      <Buyer
                        onChange={(value, action) => {
                          setJob({
                            ...job,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="BuyerID"
                        selected={job.BuyerID}
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Company</Form.Label>
                      <Company
                        onChange={(value, action) => {
                          setJob({
                            ...job,
                            [action.name]: value ? value.value : null,
                          });
                        }}
                        name="CompanyID"
                        selected={job.CompanyID}
                      />
                    </Form.Group>
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
                      {job.JobId ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              )}
              {canvasBody === "contract" && <ContractPaper job={job} />}
              {canvasBody === "jobstatus" && <JobStatus job={job} />}
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteLc}
      />
    </Fragment>
  );
};

export default LcSetup;
