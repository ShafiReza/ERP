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
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
// import { Section } from "../../components/DropDown";
const csvLink = createRef();

const EmployeeRate = () => {
  const [employeeRate, setEmployeeRate] = useState({});
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

  const getAllEmployeeRate = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("EmployeeRate?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllEmployeeRate();
  }, [getAllEmployeeRate]);

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
    setEmployeeRate({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEmployeeRate({ ...employeeRate, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveEmployeeRate = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    // const methodType = employeeRate.EmployeeRateID ? "PUT" : "POST";
    saveData("EmployeeRate", "POST", employeeRate, getAllEmployeeRate);
  };

  const deleteEmployeeRate = () => {
    deleteData(
      "EmployeeRate/" + employeeRate.EmployeeRateID,
      "DELETE",
      null,
      getAllEmployeeRate
    );
  };

  const headers = [{ label: "Unit Name", key: "ConsumptionUnitName" }];

  return (
    <Fragment>
      <Actionbar pageTitle="Employee Rate Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setEmployeeRate({});
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
        <Form.Group as={Col} sm="3">
          <Form.Control
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                cardNo: e.target.value,
              })
            }
            type="text"
            placeholder="Card No"
          />
        </Form.Group>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Card No</th>
                    <th>Section</th>
                    <th>Spec No</th>
                    <th>Starting Date</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        setEmployeeRate(item);
                      }}
                      key={item.EmployeeRateID}
                      className={
                        item.EmployeeRateID === employeeRate.EmployeeRateID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.EmployeeCardNo}</td>
                      <td>{item.Section}</td>
                      <td>{item.SpecNo}</td>
                      <td>{item.StartingDate}</td>
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
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>EmployeeRate Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveEmployeeRate}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Card No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="EmployeeCardNo"
                      value={employeeRate.EmployeeCardNo}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Section</Form.Label>
                    {/* <Section name="Section" /> */}
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="Section"
                      value={employeeRate.Section}
                      required
                    />
                  </Form.Group>
                  {/* <Form.Group as={Col}>
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="EmployeeName"
                      value={employeeRate.EmployeeName}
                    />
                  </Form.Group> */}
                </Row>
                {/* <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Curve</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="Curve"
                      value={employeeRate.Curve}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Stage</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="Stage"
                      value={employeeRate.Stage}
                      required
                    />
                  </Form.Group>
                </Row> */}
                {/* <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>RTorNHorFL</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="RTorNHorFL"
                      value={employeeRate.RTorNHorFL}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Section</Form.Label>
                    <Section name="Section" />
                  </Form.Group>
                </Row> */}
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>SpecNo</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="SpecNo"
                      value={employeeRate.SpecNo}
                    />
                  </Form.Group>
                  {/* <Form.Group as={Col}>
                    <Form.Label>TargetHour</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="TargetHour"
                      value={employeeRate.TargetHour}
                      required
                    />
                  </Form.Group> */}
                  <Form.Group as={Col} sm="6">
                    <Form.Label>Starting Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="StartingDate"
                      value={employeeRate.StartingDate}
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
                    {employeeRate.ConsumptionUnitID ? "Update" : "Save"}
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
        handleDialogYes={deleteEmployeeRate}
      />
    </Fragment>
  );
};

export default EmployeeRate;
