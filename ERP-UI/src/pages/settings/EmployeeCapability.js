import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Offcanvas,
  Nav,
  Table,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { useState, Fragment, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from "../../components/hooks/useFetch";
import Select from "react-select";

const EmployeeCapability = () => {
  const [employeeCapability, setEmployeeCapability] = useState({
    specs: [],
    rates: [],
  });
  const [specList] = useState([
    { value: 1, label: "Niddle" },
    { value: 2, label: "Sweeing" },
  ]);
  const [rateList] = useState([]);
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();

  const getAllEmployeeCapability = useCallback(() => {
    setValidated(false);
    getData("Employeecapability?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllEmployeeCapability();
  }, [getAllEmployeeCapability]);

  const saveEmployeeCapability = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    saveData("", "POST", employeeCapability, getAllEmployeeCapability);
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Employee Capability">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setEmployeeCapability({});
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <Form.Control
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                employee: e.target.value,
              })
            }
            placeholder="Search"
          />
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
                    <th>Card No</th>
                    <th>Employee Name</th>
                    <th>Designation</th>
                    <th>Specs</th>
                    <th>Rates</th>
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
                  {[].map((item, index) => (
                    <tr
                      onClick={() => {
                        setEmployeeCapability(item);
                      }}
                      key={item.BankID}
                    >
                      <td>{index + 1}</td>
                      <td>{item.BankName}</td>
                      <td>{item.BankAddress}</td>
                      <td>{item.UserID}</td>
                      <td>
                        {" "}
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button variant="btn btn-sm btn-outline-danger ms-1">
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
          <Offcanvas.Title>Spec Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveEmployeeCapability}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm="4">
                    <Form.Control
                      type="number"
                      onChange={(e) =>
                        setEmployeeCapability({
                          ...employeeCapability,
                          cardNo: e.target.value,
                        })
                      }
                      placeholder="Card No"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="4">
                    <Select
                      isMulti
                      name="roles"
                      options={specList}
                      className="basic-multi-select"
                      placeholder="Select Specs"
                      classNamePrefix="select"
                      onChange={(values) => {
                        setEmployeeCapability({
                          ...employeeCapability,

                          specs: [...values],
                        });
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="4">
                    <Select
                      isMulti
                      name="roles"
                      options={rateList}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select Rates"
                      onChange={(values) => {
                        setEmployeeCapability({
                          ...employeeCapability,
                          rates: [...values],
                        });
                      }}
                    />
                  </Form.Group>
                </Row>

                <Button variant="light" type="cancel" as={Col} sm={1}>
                  Reject
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
                    Save
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

export default EmployeeCapability;
