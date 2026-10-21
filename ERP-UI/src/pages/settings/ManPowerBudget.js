/* eslint-disable no-native-reassign */
import {
  useState,
  createRef,
  Fragment,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ReactToPrint from "react-to-print";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { Floor, Section } from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const ManPowerBudget = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [manpowerBudget, setManPowerBudget] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 300,
    excelExport: false,
    floor: "Unit-One",
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();
  let printComponent = useRef();

  const getAllManPowerBudget = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("ManpowerBudget?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllManPowerBudget();
  }, [getAllManPowerBudget]);

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
    setManPowerBudget({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setManPowerBudget({ ...manpowerBudget, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveManPowerBudget = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = manpowerBudget.Id ? "PUT" : "POST";
    saveData(
      "ManpowerBudget",
      methodType,
      manpowerBudget,
      getAllManPowerBudget
    );
  };

  const deleteOperation = () => {
    deleteData(
      "ManpowerBudget/" + manpowerBudget.OperationID,
      "DELETE",
      null,
      getAllManPowerBudget
    );
  };

  const headers = [
    { label: "Floor", key: "Floor" },
    { label: "Section", key: "SectionName" },
    { label: "Budget", key: "Budget" },
    { label: "Interim Budget", key: "InterimBudget" },
    { label: "Current Manpower", key: "CurrentManpower" },
    { label: "Balance", key: "Balance" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Manpower Budget">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setManPowerBudget({});
          }}
          className="nav-link text-primary"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => printComponent}
        />
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="Operation"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <Floor
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                pageIndex: 1,
                floor: value ? value.value : "",
              });
            }}
            selected={searchCriteria.floor}
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Section
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                pageIndex: 1,
                sectionId: value ? value.value : "",
              });
            }}
          />
        </Form.Group>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table
                responsive
                hover
                striped
                size="sm"
                ref={(el) => (printComponent = el)}
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Floor</th>
                    <th>Section</th>
                    <th>Caption</th>
                    <th>Budget</th>
                    <th>Interim Budget</th>
                    <th>Current Manpower</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        setManPowerBudget(item);
                      }}
                      key={item.Id}
                      className={
                        item.Id === manpowerBudget.Id ? "table-active" : ""
                      }
                    >
                      <td>
                        {searchCriteria.pageIndex * searchCriteria.pageSize -
                          searchCriteria.pageSize +
                          index +
                          1}
                      </td>
                      <td>{item.Floor}</td>
                      <td>{item.SectionName}</td>
                      <td>{item.Caption}</td>
                      <td>{item.Budget}</td>
                      <td>{item.InterimBudget}</td>
                      <td>{item.CurrentManpower}</td>
                      <td className={item.Balance < 0 ? "text-danger" : ""}>
                        {item.Balance}
                      </td>
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
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Men Power Budget</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveManPowerBudget}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Floor</Form.Label>

                    <Floor
                      onChange={(value, action) => {
                        setManPowerBudget({
                          ...manpowerBudget,
                          [action.name]: value ? value.ValueString : "",
                        });
                      }}
                      name="Floor"
                      selected={manpowerBudget.Floor}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Section</Form.Label>
                    <Section
                      onChange={(value, action) => {
                        setManPowerBudget({
                          ...manpowerBudget,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="SectionId"
                      selected={manpowerBudget.SectionId}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Budget</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="Budget"
                      value={manpowerBudget.Budget}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Interim Budget</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="InterimBudget"
                      value={manpowerBudget.InterimBudget}
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
                    {manpowerBudget.Id ? "Update" : "Save"}
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
        handleDialogYes={deleteOperation}
      />
    </Fragment>
  );
};

export default ManPowerBudget;
