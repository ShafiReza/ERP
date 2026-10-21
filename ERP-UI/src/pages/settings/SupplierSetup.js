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
  Pagination,
  Offcanvas,
  Nav,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const SupplierSetup = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [supplier, setSupplier] = useState({});
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

  const getAllSupplier = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Supplier?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllSupplier();
  }, [getAllSupplier]);

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
    setSupplier({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveSupplier = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = supplier.SupplierID ? "PUT" : "POST";
    saveData("Supplier", methodType, supplier, getAllSupplier);
  };

  const deleteSupplier = () => {
    deleteData(
      "Supplier/" + supplier.SupplierID,
      "DELETE",
      null,
      getAllSupplier
    );
  };

  const headers = [
    { label: "Supplier Name", key: "SupplierName" },
    { label: "Email", key: "Email" },
    { label: "Address", key: "Address" },
    { label: "Phone No", key: "ContactNumber" },
  ];

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
          <Offcanvas.Title>Supplier Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveSupplier}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Supplier Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="SupplierName"
                      value={supplier.SupplierName}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="email"
                      name="Email"
                      value={supplier.Email}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="Address"
                      value={supplier.Address}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="ContactNumber"
                      value={supplier.ContactNumber}
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
                    {supplier.SupplierID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <Actionbar pageTitle="Supplier Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setSupplier({});
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
          filename="Supplier"
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
                phone: e.target.value,
              })
            }
            type="text"
            name="phone"
            placeholder="Search"
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
                    <th>Supplier Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Contact Number</th>
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
                        setSupplier(item);
                      }}
                      key={item.SupplierID}
                      className={
                        item.SupplierID === supplier.SupplierID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.SupplierName}</td>
                      <td>{item.Email}</td>
                      <td>{item.Address}</td>
                      <td>{item.ContactNumber}</td>
                      <td className="col-md-1">
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
        handleDialogYes={deleteSupplier}
      />
    </Fragment>
  );
};

export default SupplierSetup;
