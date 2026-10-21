/* eslint-disable no-native-reassign */
import {
  useState,
  createRef,
  Fragment,
  useTransition,
  useEffect,
  useCallback,
} from "react";
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

const BankSetup = () => {
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [bank, setBank] = useState({});
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

  const getAllBank = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Bank?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllBank();
  }, [getAllBank]);

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
    setBank({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBank({ ...bank, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveBank = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = bank.BankID ? "PUT" : "POST";
    saveData("Bank", methodType, bank, getAllBank);
  };

  const deleteBank = () => {
    deleteData("Bank/" + bank.BankID, "DELETE", null, getAllBank);
  };

  const headers = [
    { label: "Bank Nmae", key: "BankName" },
    { label: "Bank Address", key: "BankAddress" },
  ];

  const filteredData = res.data.filter((el) => {
    if (searchText === "") {
      return el;
    } else {
      return (
        el.BankName.toLowerCase().includes(searchText) ||
        el.BankAddress.toLowerCase().includes(searchText) ||
        el.UserID.toString().toLowerCase().includes(searchText)
      );
    }
  });

  return (
    <Fragment>
      <Actionbar pageTitle="Bank Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setBank({});
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
          filename="BankList"
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

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Bank Address</th>
                    <th>Routing No</th>
                    <th>Swift Code</th>
                    <th>Credit Limit</th>
                    <th>Available Credit</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {(res.dataLoading || isPending) && (
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
                  {filteredData.map((item, index) => (
                    <tr
                      onClick={() => {
                        setBank(item);
                      }}
                      key={item.BankID}
                      className={
                        item.BankID === bank.BankID ? "table-active" : ""
                      }
                    >
                      <td>{item.BankName}</td>
                      <td>{item.BankAddress}</td>
                      <td>{item.AccountNo}</td>
                      <td>{item.SwiftCode}</td>
                      <td>
                        $
                        {item.CreditLimit?.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        $
                        {item.AvailableCredit?.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {" "}
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
          <Offcanvas.Title>Bank Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveBank}
                method="POST"
              >
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="BankName"
                      value={bank.BankName}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Credit Limit($)</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="CreditLimit"
                      value={bank.CreditLimit}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Routing No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="AccountNo"
                      value={bank.AccountNo}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Swift Code</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="SwiftCode"
                      value={bank.SwiftCode}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      as="textarea"
                      name="BankAddress"
                      value={bank.BankAddress}
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
                    {bank.BankID ? "Update" : "Save"}
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
        handleDialogYes={deleteBank}
      />
    </Fragment>
  );
};

export default BankSetup;
