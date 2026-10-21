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

import {
  useState,
  Fragment,
  createRef,
  useTransition,
  useCallback,
  useEffect,
} from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const UnitSetup = () => {
  const [unit, setUnit] = useState({});
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
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

  const getAllUnit = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Unit?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllUnit();
  }, [getAllUnit]);

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
    setUnit({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUnit({ ...unit, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveUnit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = unit.ConsumptionUnitID ? "PUT" : "POST";
    saveData("Unit", methodType, unit, getAllUnit);
  };

  const deleteUnit = () => {
    deleteData("Unit/" + unit.ConsumptionUnitID, "DELETE", null, getAllUnit);
  };

  const headers = [{ label: "Unit Name", key: "ConsumptionUnitName" }];

  const filteredData = res.data.filter((el) => {
    if (searchText === "") {
      return el;
    } else {
      return el.ConsumptionUnitName.toLowerCase().includes(searchText);
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
          <Offcanvas.Title>Unit Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveUnit}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Unit Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="ConsumptionUnitName"
                      value={unit.ConsumptionUnitName}
                      required
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
                    {unit.ConsumptionUnitID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <Actionbar pageTitle="Unit Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setUnit({});
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
        <Col sm="3">
          <Form.Group>
            <Form.Control
              onChange={(e) =>
                startTransition(() =>
                  setSearchText(e.target.value.toLowerCase())
                )
              }
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
                    <th>Unit Name</th>
                  </tr>
                </thead>
                <tbody>
                  {(res.dataLoading || isPending) && (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {filteredData.map((item, index) => (
                    <tr
                      onClick={() => {
                        setUnit(item);
                      }}
                      key={item.ConsumptionUnitID}
                      className={
                        item.ConsumptionUnitID === unit.ConsumptionUnitID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.ConsumptionUnitName}</td>
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
        handleDialogYes={deleteUnit}
      />
    </Fragment>
  );
};

export default UnitSetup;
