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
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import {
  OperationCatogory,
  JobClass,
  StyleOperation,
  ItemCategory,
} from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const OperationSetup = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [operation, setOperation] = useState({});
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

  const getAllOperation = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Operation?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllOperation();
  }, [getAllOperation]);

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
    setOperation({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOperation({ ...operation, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveOperation = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    // const methodType = operation.OperationID ? "PUT" : "POST";
    saveData("Operation", "POST", operation, getAllOperation);
  };

  const deleteOperation = () => {
    deleteData(
      "Operation/" + operation.OperationID,
      "DELETE",
      null,
      getAllOperation
    );
  };

  const headers = [
    { label: "Operation Name", key: "OperationName" },
    { label: "Operation Code", key: "OperationCodeNo" },
    { label: "Operation Category", key: "OperationCategoryID" },
    { label: "Job Class", key: "JobClassID" },
  ];

  return (
    <Fragment>
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Operation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveOperation}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="OperationName"
                      value={operation.OperationName}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Operation Code</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="OperationCodeNo"
                      value={operation.OperationCodeNo}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Operation Category</Form.Label>
                    <OperationCatogory
                      onChange={(value, action) => {
                        setOperation({
                          ...operation,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="OperationCategoryID"
                      selected={operation.OperationCategoryID}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Job Class</Form.Label>
                    <JobClass
                      onChange={(value, action) => {
                        setOperation({
                          ...operation,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="JobClassID"
                      selected={operation.JobClassID}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Machine</Form.Label>
                    <ItemCategory
                      onChange={(value, action) => {
                        setOperation({
                          ...operation,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="MachineID"
                      selected={operation.MachineID}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>SAM</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="Sam"
                      value={operation.Sam}
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
                    {operation.OperationID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <Actionbar pageTitle="Operation Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setOperation({});
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
          filename="Operation"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2 mb-2">
        <Col sm="3">
          <Form.Group>
            <StyleOperation
              onChange={(value) => {
                setSearchCriteria({
                  ...searchCriteria,
                  operationId: value ? value.value : "",
                });
              }}
            />
          </Form.Group>
        </Col>
        <Col sm="3">
          <Form.Group>
            <OperationCatogory
              onChange={(value) => {
                setSearchCriteria({
                  ...searchCriteria,
                  operationCategoryId: value ? value.value : "",
                });
              }}
            />
          </Form.Group>
        </Col>
        <Col sm="3">
          <Form.Group>
            <JobClass
              onChange={(value) => {
                setSearchCriteria({
                  ...searchCriteria,
                  jobClassId: value ? value.value : "",
                });
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>Operation Code</th>
                    <th>Operation Name</th>

                    <th>Operation Category</th>
                    <th>JobClass</th>
                    <th>Machine</th>
                    <th>SAM</th>
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
                        setOperation(item);
                      }}
                      key={item.OperationID}
                      className={
                        item.OperationID === operation.OperationID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{item.OperationCodeNo}</td>
                      <td>{item.OperationName}</td>
                      <td>{item.OperationCategoryName}</td>
                      <td>{item.JobClassName}</td>
                      <td>{item.MachineID}</td>
                      <td>{item.Sam}</td>
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
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteOperation}
      />
    </Fragment>
  );
};

export default OperationSetup;
