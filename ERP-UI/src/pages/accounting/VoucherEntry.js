import {
  useState,
  useRef,
  createRef,
  Fragment,
  useCallback,
  useEffect,
} from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Pagination,
  Nav,
} from "react-bootstrap";
import ReactToPrint from "react-to-print";

import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import Canvas from "../../components/layout/Canvas";
import {
  AccountNo,
  CostCenter,
  Year,
  Month,
  VoucherType,
  Factory,
} from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
import ConfirmDialog from "../../components/ConfirmDialog";
const csvLink = createRef();

const VoucherEntry = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  let entryRef = useRef();
  const [showDialog, setShowDialog] = useState(false);

  const [voucherEntry, setVoucherEntry] = useState({
    EntryDate: new Date(),
  });
  const [validated, setValidated] = useState(false);
  const [inputList, setInputList] = useState([{}, {}]);

  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllTransactions = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Transactions?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

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

  const getSumDebit = (arr) => {
    let sum = 0;
    arr.forEach((el) => (sum += Number(el.Debit || 0)));
    return Number(sum);
  };

  const getSumCredit = (arr) => {
    let sum = 0;
    arr.forEach((el) => (sum += Number(el.Credit || 0)));
    return Number(sum);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setVoucherEntry({ ...voucherEntry, [name]: value });
  };

  const handleChange = (e, index) => {
    let { name, value } = e.target;
    if (name === "Credit" || name === "Debit") {
      value = parseInt(value);
    }
    const list = [...inputList];
    list[index][name] = value;

    if (name === "Credit") {
      list[index]["Debit"] = 0;
    }

    if (name === "Debit") {
      list[index]["Credit"] = 0;
    }

    setInputList(list);
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const addRowClick = () => {
    setInputList([...inputList, {}]);
  };

  const removeInputRowClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleCostcenter = (index) => {
    let list = [...inputList];
    list[index]["costCenterId"] = voucherEntry.costCenterId;
    setInputList(list);
  };

  const getVoucherById = (item) => {
    console.log(voucherEntry);
    setShowCanvas(true);
    setCanvasBody("form");
    setVoucherEntry({});
    setInputList([]);
    fetch(
      process.env.REACT_APP_API_URL + "Transactions/" + item.TransactionID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setVoucherEntry(result);
        setInputList(result.TransactionDetailList);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const saveVoucherEntry = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (getSumDebit(inputList) !== getSumCredit(inputList)) {
      toast.warn("Debit and Credit value not match", {
        position: "top-center",
      });
      return;
    }
    for (let i = 0; i < inputList.length; i++) {
      if (!inputList[i]["AccountID"] || inputList[i]["AccountID"] === 0) {
        toast.error(`Please Select Account at Row ${i + 1}`);
        return;
      }
    }
    // setVoucherEntry({ ...voucherEntry, TransactionDetailList: inputList });
    voucherEntry.TransactionDetailList = inputList;
    saveData("Transactions", "POST", voucherEntry, getAllTransactions);
  };

  const deleteVoucher = () => {
    deleteData(
      "Transactions/" + voucherEntry.TransactionID,
      "DELETE",
      null,
      getAllTransactions
    );
  };

  const headers = [
    { label: "Transaction No", key: "TransactionID" },
    { label: "Value Date", key: "ValueDate" },
    { label: "Particular", key: "GeneralParticular" },
    { label: "Amount", key: "DrCrAmount" },
    { label: "Created By", key: "CreatedBy" },
    { label: "Entry Date", key: "EntryDate" },
    { label: "Branch", key: "BranchID" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Voucher Entry">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setCanvasBody("form");
            setVoucherEntry({ EntryDate: new Date() });
            setInputList([{}, {}]);
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
          filename="Transactions"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col sm="12">
          <Row className="mb-2">
            <Col>
              <Row>
                <Form.Group as={Col} sm="2">
                  <Year
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="year"
                    selected={searchCriteria.year}
                  />
                </Form.Group>
                <Form.Group as={Col} sm="2">
                  <Month
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="month"
                    selected={searchCriteria.month}
                  />
                </Form.Group>

                <Form.Group as={Col} sm="2">
                  <Factory
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="branchId"
                  />
                </Form.Group>
                <Form.Group as={Col} sm="2">
                  <VoucherType
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="voucherType"
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive striped hover size="sm">
                    <thead>
                      <tr>
                        <th>Tran.No</th>
                        <th>Tran. Date</th>
                        <th>Particular</th>
                        <th>Amount</th>
                        <th>Created By</th>
                        <th>Entry Date</th>
                        <th>Factory</th>
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
                      {!res.dataLoading && res.data?.length === 0 && (
                        <tr>
                          <td colSpan="7" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data?.map((item, index) => (
                        <tr
                          key={item.TransactionID}
                          onClick={() => {
                            setVoucherEntry(item);
                          }}
                          className={
                            item.TransactionID === voucherEntry.TransactionID
                              ? "table-active"
                              : ""
                          }
                        >
                          <td>{item.TransactionID}</td>
                          <td>{item.ValueDate}</td>
                          <td className="col-2">{item.GeneralParticular}</td>
                          <td>{item.DrCrAmount.toLocaleString()}</td>
                          <td>{item.CreatedBy}</td>
                          <td>{item.EntryDate}</td>
                          <td>
                            {item.BranchID === 1052 ? "ASWL KNIT" : ""}
                            {item.BranchID === 1039 ? "ASWL WOVEN" : ""}
                            {item.BranchID === 1048 ? "DMC WASH" : ""}
                            {item.BranchID === 1051 ? "DMC WOVEN" : ""}
                          </td>
                          <td>
                            <Button
                              variant="btn btn-sm btn-outline-primary ms-1"
                              onClick={() => getVoucherById(item)}
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
        </Col>
      </Row>

      <Canvas
        showCanvas={showCanvas}
        handleClose={handleClose}
        title="Voucher Entry"
        canvasStyle="w-75"
      >
        <Card>
          <Card.Body>
            {canvasBody === "form" && (
              <Form
                noValidate
                validated={validated}
                onSubmit={saveVoucherEntry}
                method="POST"
              >
                <Fragment>
                  <div className="text-end">
                    {" "}
                    <ReactToPrint
                      trigger={() => (
                        <Nav.Link className="nav-link text-primary">
                          <FontAwesomeIcon icon="fa-solid fa-print" /> Print
                        </Nav.Link>
                      )}
                      content={() => entryRef}
                    />
                  </div>
                  <div className="p-1" ref={(el) => (entryRef = el)}>
                    <Row className="mb-3">
                      <Form.Group as={Col}>
                        <Form.Control
                          onChange={(e) => handleInputChange(e)}
                          type="date"
                          name="ValueDate"
                          value={voucherEntry.ValueDate}
                          required
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Factory
                          onChange={(value, action) => {
                            setVoucherEntry({
                              ...voucherEntry,
                              [action.name]: value ? value.value : null,
                            });
                          }}
                          name="BranchID"
                          selected={voucherEntry.BranchID}
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <CostCenter
                          onChange={(value, action) => {
                            setVoucherEntry({
                              ...voucherEntry,
                              [action.name]: value ? value.value : null,
                            });
                          }}
                          name="CostCenterID"
                          selected={voucherEntry.CostCenterID}
                          placeholder="Select Cost Center"
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <VoucherType
                          onChange={(value, action) => {
                            setVoucherEntry({
                              ...voucherEntry,
                              [action.name]: value ? value.value : null,
                            });
                          }}
                          name="VoucherTypeID"
                          selected={voucherEntry.VoucherTypeID}
                        />
                      </Form.Group>
                    </Row>
                    <Table responsive striped hover size="sm" bordered>
                      <thead>
                        <tr>
                          <th className="col-6">Account</th>
                          <th className="text-center">Debit</th>
                          <th className="text-center">Credit</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {inputList?.map((x, i) => {
                          return (
                            <tr key={i}>
                              <td>
                                <AccountNo
                                  onChange={(value) => {
                                    x.AccountID = value ? value.value : null;
                                    setInputList([...inputList]);
                                    handleCostcenter(i);
                                  }}
                                  name="AccountID"
                                  placeholder="Select Account"
                                  selected={x.AccountID}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  onChange={(e) => handleChange(e, i)}
                                  type="number"
                                  name="Debit"
                                  value={x.Debit}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  onChange={(e) => handleChange(e, i)}
                                  type="number"
                                  name="Credit"
                                  value={x.Credit}
                                />
                              </td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  onClick={(e) => removeInputRowClick(i)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}

                        <tr className="fw-bold">
                          <td>Total</td>
                          <td>{getSumDebit(inputList)}</td>
                          <td>{getSumCredit(inputList)}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              onClick={addRowClick}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4">
                            <Form.Group>
                              <Form.Control
                                onChange={(e) => handleInputChange(e)}
                                name="GeneralParticular"
                                as="textarea"
                                placeholder="Notes"
                                rows={3}
                                value={voucherEntry.GeneralParticular}
                              />
                            </Form.Group>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Fragment>

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
                    Save
                  </Button>
                )}
              </Form>
            )}
          </Card.Body>
        </Card>
      </Canvas>

      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteVoucher}
      />
    </Fragment>
  );
};

export default VoucherEntry;
