import { useState, createRef, Fragment, useCallback, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  InputGroup,
  Offcanvas,
  Pagination,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BL, PI } from "../../components/DropDown";
import { CSVLink } from "react-csv";
import ModalDialog from "../../components/Dialog";
const csvLink = createRef();

const InventoryReceive = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [challan, setChallan] = useState({});
  const [master, setMaster] = useState({
    storeId: "",
    supplierId: "",
    ReceivedDate: new Date().toISOString().split("T")[0],
    chalanNo: "",
    chalanQuantity: 0,
    InventoryReceiveDetails: [],
  });
  const [inventoryReceiveDetails, setInputList] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const handleDialogNo = () => {
    setShowDialog(false);
  };
  const handleChallanChange = (event) => {
    const { name, value } = event.target;
    setChallan({ ...challan, [name]: value });
  };
  const getAllInventoryReceive = useCallback(() => {
    setValidated(false);
    getData("InventoryReceive?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllInventoryReceive();
  }, [getAllInventoryReceive]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...inventoryReceiveDetails];
    list[index][name] = value;
    if (name === "receivedQuantity" || name === "deductQuantity") {
      list[index]["stockQuantity"] =
        list[index]["receivedQuantity"] - list[index]["deductQuantity"];
    }
    setInputList(list);
  };

  const saveInventoryReceive = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (!master.ReceivedDate || !master.PiID || !master.BLID) {
      toast.warn("Please select PI, BL and Date", {
        position: "bottom-right",
      });
      return;
    }
    const formBody = [];
    inventoryReceiveDetails.forEach((item) => {
      formBody.push({
        ...item,
        PiID: master.PiID,
        BLID: master.BLID,
        ReceivedDate: master.ReceivedDate,
      });
    });
    saveData("InventoryReceive", "POST", formBody, getAllInventoryReceive);
  };

  const saveBL = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    saveData("ImportInvoice", "POST", challan);
    setToggle(!toggle);
  };

  const removeMasterRowClick = () => {
    deleteData(
      "InventoryReceive/" + master.id,
      "DELETE",
      getAllInventoryReceive
    );
  };

  const headers = [
    { label: "Received Date", key: "receivedDate" },
    { label: "Store", key: "storeName" },
    { label: "Chalan No", key: "chalanNo" },
    { label: "Supplier", key: "supplierName" },
  ];

  const getBookingDetails = (obj) => {
    if (obj.PiID && obj.BLID) {
      setLoading(true);
      setInputList([]);
      fetch(
        process.env.REACT_APP_API_URL +
          "InventoryReceive/GetBookingDetails?" +
          new URLSearchParams({ piId: obj.PiID, blId: obj.BLID }),

        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (Array.isArray(response)) {
            setInputList(response);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setInputList([]);
    }
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Inventory Receive">
        <Nav.Link
          onClick={() => {
            setMaster({ ReceivedDate: new Date().toISOString().split("T")[0] });
            setShowCanvas(true);
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
          filename="ItemList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2 mb-2">
        <Col>
          <Row className="mb-2">
            <Form.Group as={Col} sm="3">
              <BL
                onChange={(value, action) =>
                  setSearchCriteria({
                    ...searchCriteria,

                    [action.name]: value ? value.value : null,
                    pageIndex: 1,
                  })
                }
                name="blId"
              />
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <InputGroup>
                <InputGroup.Text>From</InputGroup.Text>
                <Form.Control
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      fromDate: e.target.value,
                      pageIndex: 1,
                    })
                  }
                  type="date"
                  name="fromDate"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} sm="3">
              <InputGroup>
                <InputGroup.Text>To</InputGroup.Text>
                <Form.Control
                  onChange={(e) =>
                    setSearchCriteria({
                      ...searchCriteria,
                      toDate: e.target.value,
                      pageIndex: 1,
                    })
                  }
                  type="date"
                  name="toDate"
                />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive striped hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Chalan/BL No</th>
                        <th>BL Date</th>
                        <th>Invoice No</th>
                        <th>Supplier</th>
                        <th>Received By</th>
                        <th>Received Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.dataLoading && (
                        <tr>
                          <td colSpan="16" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!res.dataLoading && res.data.length === 0 && (
                        <tr>
                          <td colSpan="16" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() =>
                            setMaster({
                              PiID: item.PiId,
                              BLID: item.BLId,
                              ReceivedDate: item.ReceivedDate,
                            })
                          }
                        >
                          <td>
                            {searchCriteria.pageIndex *
                              searchCriteria.pageSize -
                              searchCriteria.pageSize +
                              index +
                              1}
                          </td>
                          <td>{item.BLNo}</td>
                          <td>{item.BLDate}</td>
                          <td>{item.InvoiceNo}</td>
                          <td>{item.SupplierName}</td>
                          <td>{item.ReceivedBy}</td>
                          <td>{item.ReceivedDate}</td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setShowCanvas(true);
                                getBookingDetails({
                                  PiID: item.PiId,
                                  BLID: item.BLId,
                                  ReceivedDate: item.ReceivedDate,
                                });
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>{" "}
                            <Button
                              variant="btn btn-sm btn-outline-danger"
                              onClick={(e) =>
                                removeMasterRowClick(e, index, item)
                              }
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

      <Offcanvas
        show={showCanvas}
        onHide={() => {
          setShowCanvas(false);
          setMaster({});
          setInputList([]);
        }}
        placement="end"
        className="w-100"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Inventory Receive</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveInventoryReceive}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm="3">
                    <PI
                      onChange={(value, action) => {
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="PiID"
                      selected={master.PiID}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="3">
                    <BL
                      onChange={(value, action) => {
                        setMaster({
                          ...master,

                          BLID: value ? value.value : null,
                        });
                      }}
                      selected={master.BLID}
                      toggle={toggle}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="1">
                    <Button
                      onClick={() => setShowDialog(true)}
                      variant="outline-primary"
                    >
                      +
                    </Button>
                  </Form.Group>
                  <Form.Group as={Col} sm="3">
                    <InputGroup>
                      <InputGroup.Text>Receive Date</InputGroup.Text>
                      <Form.Control
                        onChange={(e) =>
                          setMaster({
                            ...master,
                            ReceivedDate: e.target.value,
                          })
                        }
                        value={master.ReceivedDate}
                        type="date"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} sm="2">
                    <Button
                      variant="outline-primary"
                      onClick={() => getBookingDetails(master)}
                    >
                      Preview
                    </Button>
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Table striped size="sm" responsive hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>PO No</th>
                        <th>Category</th>
                        <th>Item Description</th>

                        <th>Item Color</th>
                        <th>Item Size</th>
                        <th>Unit</th>
                        <th>Total Received</th>
                        <th>Total Issued</th>
                        <th>Current Stock</th>
                        <th>Invoice Qty</th>
                        <th>Received Qty</th>

                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td colSpan="13" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {inventoryReceiveDetails.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{x.PONo}</td>
                            <td>{x?.ItemCategoryName}</td>
                            <td>{x.ItemName}</td>

                            <td>{x.ItemColor}</td>
                            <td>{x.ItemSize}</td>
                            <td>{x.UnitName}</td>
                            <td>{x.TotalReceived}</td>
                            <td>{x.TotalIssued}</td>
                            <td>{x.CurrentStock}</td>
                            <td>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="InvoiceQuantity"
                                value={x.InvoiceQuantity}
                              />
                            </td>
                            <td>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="ReceivedQuantity"
                                value={x.ReceivedQuantity}
                              />
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="fw-bold">
                        <td colSpan={10}>Total</td>
                        <td className="text-end">
                          {inventoryReceiveDetails.reduce((tot, itm) => {
                            if (
                              itm.InvoiceQuantity !== null ||
                              itm.InvoiceQuantity !== undefined
                            ) {
                              return (tot = tot + Number(itm.InvoiceQuantity));
                            }
                            return tot;
                          }, 0)}
                        </td>
                        <td className="text-end">
                          {inventoryReceiveDetails.reduce((tot, itm) => {
                            if (
                              itm.ReceivedQuantity !== null ||
                              itm.ReceivedQuantity !== undefined
                            ) {
                              return (tot = tot + Number(itm.ReceivedQuantity));
                            }
                            return tot;
                          }, 0)}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
                <Button variant="light" type="submit" as={Col} sm={1}>
                  Cancel
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
      <ModalDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        title="Add Challan"
      >
        <Form noValidate validated={validated} onSubmit={saveBL} method="POST">
          <Row>
            <Form.Group as={Col} sm="6">
              <Form.Label>Challan No</Form.Label>
              <Form.Control
                onChange={(e) => handleChallanChange(e)}
                name="BLNo"
                required
              />
            </Form.Group>
            <Form.Group as={Col} sm="6">
              <Form.Label>Challan Date</Form.Label>
              <Form.Control
                onChange={(e) => handleChallanChange(e)}
                name="BLDate"
                type="date"
                required
              />
            </Form.Group>
          </Row>
          <Button variant="primary" type="submit" className="float-end mt-2">
            Save
          </Button>
        </Form>
      </ModalDialog>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default InventoryReceive;
