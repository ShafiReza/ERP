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
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Buyer,
  Customer,
  Division,
  Style as StyleDropdown,
} from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const Style = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [style, setStyle] = useState({});
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
    accountId: 1,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllStyles = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Styles?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllStyles();
  }, [getAllStyles]);

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
    setStyle({});
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "SAM") {
      value = parseFloat(value);
    }
    setStyle({ ...style, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const handleRowClick = (item) => {
    setStyle(item);
  };

  const saveStyle = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = style.StyleID ? "PUT" : "POST";
    saveData("Styles", methodType, style, getAllStyles);
  };

  const deleteStyle = () => {
    deleteData("Styles/" + style.StyleID, "DELETE", null, getAllStyles);
  };

  const headers = [
    { label: "Style No", key: "StyleNo" },
    { label: "SAM", key: "SAM" },
    { label: "HS Code", key: "HSCode" },
    { label: "Division Name", key: "DivisionName" },
    { label: "Buyer Name", key: "BuyerName" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Style">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setStyle({
              AccountID: 1,
              CustomerID: 9,
              Capacity: 1000,
            });
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
          filename="Styles"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <StyleDropdown
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,
                [action.name]: value ? value.value : null,
              })
            }
            name="styleId"
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Buyer
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,
                [action.name]: value ? value.value : null,
              })
            }
            name="buyerId"
          />
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Style No</th>
                    <th>SAM</th>
                    <th>HS Code</th>
                    <th>Type</th>
                    <th>Buyer</th>
                    <th>Customer</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      onClick={() => {
                        handleRowClick(item);
                      }}
                      key={item.StyleID}
                      className={
                        item.StyleID === style.StyleID ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.StyleNo}</td>
                      <td>{item.SAM}</td>
                      <td>{item.HSCode}</td>
                      <td>{item.DivisionName}</td>
                      <td>{item.BuyerName}</td>
                      <td>{item.CustomerName}</td>
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
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Style Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveStyle}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Style No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="StyleNo"
                      value={style.StyleNo}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>SAM</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="SAM"
                      value={style.SAM}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Style Description</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      as="textarea"
                      name="StyleDescription"
                      value={style.StyleDescription}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Fabrication</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      as="textarea"
                      name="Febrication"
                      value={style.Febrication}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>HS Code</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="HSCode"
                      value={style.HSCode}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Division</Form.Label>
                    <Division
                      onChange={(value, action) =>
                        setStyle({
                          ...style,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="DivisionID"
                      selected={style.DivisionID}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Buyer</Form.Label>
                    <Buyer
                      onChange={(value, action) =>
                        setStyle({
                          ...style,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="BuyerID"
                      selected={style.BuyerID}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Customer</Form.Label>
                    <Customer
                      onChange={(value, action) =>
                        setStyle({
                          ...style,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="CustomerID"
                      selected={style.CustomerID}
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
                    {style.StyleID ? "Update" : "Save"}
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
        handleDialogYes={deleteStyle}
      />
    </Fragment>
  );
};

export default Style;
