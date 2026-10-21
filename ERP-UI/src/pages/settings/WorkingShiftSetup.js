/* eslint-disable no-native-reassign */
import { useState, createRef, Fragment } from "react";
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
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const WorkingShiftSetup = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [workingShift, setWorkingShift] = useState({});
  const [toggle, setToggle] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res] = useGetAll("WorkingShift?", searchCriteria, toggle);

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
    setWorkingShift({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setWorkingShift({ ...workingShift, [name]: value });
  };

  const removeRowClick = (e, index, item) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "WorkingShift", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Delete Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setLoading(false);
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleRowClick = (item) => {
    setWorkingShift(item);
  };

  const saveWorkingShift = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const methodType = workingShift.id ? "PUT" : "POST";

    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "WorkingShift", {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(workingShift),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          response.json().then((data) => {
            toast.error(response.statusText + " - " + data.Message, {
              position: "bottom-right",
            });
          });
        }
        setValidated(false);
        setLoading(false);
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "In Time", key: "inTime" },
    { label: "Out Time", key: "outTime" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Working Shift">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setWorkingShift({});
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
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>In Time</th>
                    <th>Out Time</th>
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
                        item.id === workingShift.id ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.inTime}</td>
                      <td>{item.outTime}</td>
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
                          onClick={(e) => removeRowClick(e, index, item)}
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
          <Offcanvas.Title>Working Shift Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveWorkingShift}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="name"
                      value={workingShift.name}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>In Time</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="datetime-local"
                      name="inTime"
                      value={workingShift.inTime}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Out Time</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="datetime-local"
                      name="outTime"
                      value={workingShift.outTime}
                    />
                  </Form.Group>
                </Row>

                <Button variant="light" onClick={handleReset}>
                  Reset
                </Button>
                {loading ? (
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
                    {workingShift.id ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default WorkingShiftSetup;
