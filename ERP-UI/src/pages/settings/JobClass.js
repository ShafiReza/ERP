/* eslint-disable no-native-reassign */
import { useState, Fragment, createRef, useEffect, useCallback } from "react";
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
import { CSVLink } from "react-csv";
const csvLink = createRef();

const JobClass = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [jobClass, setJobClass] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllJobClass = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("JobClass?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllJobClass();
  }, [getAllJobClass]);

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
    setJobClass({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJobClass({ ...jobClass, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveJobClass = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = jobClass.JobClassID ? "PUT" : "POST";
    saveData("JobClass", methodType, jobClass, getAllJobClass);
  };

  const deleteJobClass = () => {
    deleteData(
      "JobClass/" + jobClass.JobClassID,
      "DELETE",
      null,
      getAllJobClass
    );
  };

  const headers = [
    { label: "JobClass Name", key: "JobClassName" },
    { label: "Base Rate", key: "BaseRate" },
    { label: "Max Paid", key: "MaxPaid" },
  ];

  const filteredData = res.data.filter((el) => {
    if (searchText === "") {
      return el;
    } else {
      return (
        el.JobClassName.toLowerCase().includes(searchText) ||
        el.BaseRate.toString().toLowerCase().includes(searchText) ||
        el.MaxPaid.toString().toLowerCase().includes(searchText)
      );
    }
  });

  return (
    <Fragment>
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveJobClass}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="JobClassName"
                      value={jobClass.JobClassName}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Base Rate</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="BaseRate"
                      value={jobClass.BaseRate}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Max Paid</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="MaxPaid"
                      value={jobClass.MaxPaid}
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
                    {jobClass.JobClassID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <Actionbar pageTitle="Job Class Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setJobClass({});
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
          filename="JobClass"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <Form.Control
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
              placeholder="Search"
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
                    <th>JobClass Name</th>
                    <th>Base Rate</th>
                    <th>Max Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {filteredData.map((item, index) => (
                    <tr
                      onClick={() => {
                        setJobClass(item);
                      }}
                      key={item.JobClassID}
                      className={
                        item.JobClassID === jobClass.JobClassID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.JobClassName}</td>
                      <td>{item.BaseRate}</td>
                      <td>{item.MaxPaid}</td>
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
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteJobClass}
      />
    </Fragment>
  );
};

export default JobClass;
