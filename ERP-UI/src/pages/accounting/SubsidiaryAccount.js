import {
  Nav,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  Table,
} from "react-bootstrap";
import { useState, createRef, useCallback, Fragment, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import Canvas from "../../components/layout/Canvas";
import { AccountType, ParentAccount } from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const SubsidiaryAccount = () => {
  const [subsidiaryAccount, setSubsidiaryAccount] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);
  const [validated, setValidated] = useState(false);
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

  const getAllSubsidiaryAccount = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("SubsidiaryAccounts?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllSubsidiaryAccount();
  }, [getAllSubsidiaryAccount]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setSubsidiaryAccount({});
  };

  const handleClose = useCallback(
    () => setShowCanvas(!showCanvas),
    [showCanvas]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubsidiaryAccount({ ...subsidiaryAccount, [name]: value });
  };

  const handleRowClick = (item) => {
    setSubsidiaryAccount(item);
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveSubsidiaryAccount = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = subsidiaryAccount.AccountID ? "PUT" : "POST";
    saveData(
      "SubsidiaryAccounts",
      methodType,
      subsidiaryAccount,
      getAllSubsidiaryAccount
    );
  };

  const deleteSubsidiaryAccount = () => {
    deleteData(
      "SubsidiaryAccounts/" + subsidiaryAccount.AccountID,
      "DELETE",
      getAllSubsidiaryAccount
    );
  };

  const headers = [
    { label: "Account No", key: "AccountNo" },
    { label: "Account Name", key: "AccountName" },
    { label: "Account Type", key: "AccountType" },
    { label: "Parent Account No", key: "ParentAccountNo" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Subsidiary Account">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setSubsidiaryAccount({
              AccountType: "N/A",
              IsAutoEntry: false,
              BranchTypeWiseAccountID: 1,
              CashFlowID: 1,
              AccountIdentityNo: 1,
              UserID: "System",
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
          filename="AccountList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2 mb-2">
        <Col>
          <Row className="mb-2">
            <Form.Group as={Col} sm="3">
              <AccountType
                onChange={(value, action) =>
                  setSearchCriteria({
                    ...searchCriteria,

                    [action.name]: value ? value.value : null,
                  })
                }
                name="accountTypeId"
              />
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <ParentAccount
                onChange={(value, action) =>
                  setSearchCriteria({
                    ...searchCriteria,

                    [action.name]: value ? value.value : null,
                  })
                }
                name="parentAccountId"
              />
            </Form.Group>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive hover size="sm" striped>
                    <thead>
                      <tr>
                        <th>Account No</th>
                        <th>Account Name</th>
                        <th>Account Type</th>
                        <th>Parent Account</th>
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
                      {!res.dataLoading && res.data?.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data?.map((item, index) => (
                        <tr
                          onClick={() => {
                            handleRowClick(item);
                          }}
                          key={item.AccountID}
                          className={
                            item.AccountID === subsidiaryAccount.AccountID
                              ? "table-active"
                              : ""
                          }
                        >
                          <td>{item.AccountNo}</td>
                          <td>{item.AccountName}</td>
                          <td>{item.AccountType}</td>
                          <td>{item.ParentAccountNo}</td>

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
        </Col>
      </Row>
      <Canvas
        showCanvas={showCanvas}
        handleClose={handleClose}
        title="Subsidiary Account"
      >
        <Form
          noValidate
          validated={validated}
          onSubmit={saveSubsidiaryAccount}
          method="POST"
        >
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Account No</Form.Label>
              <Form.Control
                type="text"
                name="AccountNo"
                value={subsidiaryAccount.AccountNo}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                name="AccountName"
                value={subsidiaryAccount.AccountName}
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Account Type</Form.Label>
              <AccountType
                onChange={(value, action) =>
                  setSubsidiaryAccount({
                    ...subsidiaryAccount,
                    [action.name]: value ? value.value : null,
                  })
                }
                name="AccountTypeID"
                selected={subsidiaryAccount.AccountTypeID}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Parent Account</Form.Label>
              <ParentAccount
                onChange={(value, action) =>
                  setSubsidiaryAccount({
                    ...subsidiaryAccount,
                    [action.name]: value ? value.value : null,
                  })
                }
                name="ParentID"
                selected={subsidiaryAccount.ParentID}
              />
            </Form.Group>
          </Row>

          <Button variant="light" onClick={handleReset}>
            Reset
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
              {subsidiaryAccount.AccountID ? "Update" : "Save"}
            </Button>
          )}
        </Form>
      </Canvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteSubsidiaryAccount}
      />
    </Fragment>
  );
};

export default SubsidiaryAccount;
