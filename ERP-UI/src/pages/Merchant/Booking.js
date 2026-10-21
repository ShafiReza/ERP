import {
  useState,
  createRef,
  Fragment,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  Offcanvas,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Item,
  Unit,
  Supplier,
  PI,
  SalesOrder,
  LC,
} from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const Booking = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showIsRequiredMsg, setShowIsRequiredMsg] = useState(false);
  const [master, setMaster] = useState({
    purchaseOrderDate: new Date().toISOString(),
    supplierDetails: {},
  });
  const [bookings, setBookings] = useState([{}]);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const excelPaste = useRef(null);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllBooking = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Bookings?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllBooking();
  }, [getAllBooking]);

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const getItemIdByCode = async (itemCode) => {
    // Make an API call to fetch itemId based on itemName
    const response = await fetch(
      process.env.REACT_APP_API_URL + `Item?itemCode=${itemCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data[0].ItemID;
    }
    return null; // Handle error or return a default value
  };

  const getUnitIdByName = async (unitName) => {
    // Make an API call to fetch unitId based on unitName
    const response = await fetch(
      process.env.REACT_APP_API_URL + `Unit?unitName=${unitName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data[0].ConsumptionUnitID;
    }
    return null; // Handle error or return a default value
  };

  const getPoIdByName = async (poNo) => {
    // Make an API call to fetch unitId based on unitName
    const response = await fetch(
      process.env.REACT_APP_API_URL + `PurchaseOrders?poNo=${poNo}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data[0].PurchaseOrderID;
    }
    return null; // Handle error or return a default value
  };

  const onPaste = async (event) => {
    const newArr = [];
    event.clipboardData.items[0].getAsString(async (text) => {
      const lines = text.split("\n");

      for (const line of lines) {
        const cell = line.split("\t");
        const PONo = cell[0];
        const itemCode = cell[1];
        const unitName = cell[5];
        try {
          const itemID = await getItemIdByCode(itemCode); // Fetch itemId asynchronously

          const unitID = await getUnitIdByName(unitName); // Fetch unitId asynchronously
          const poId = await getPoIdByName(PONo);
          newArr.push({
            PONo: PONo,
            PurchaseOrderID: poId,
            ItemID: itemID || "", // Handle null or undefined values
            ItemSize: cell[2],
            ItemColor: cell[3],
            TotalQuantity: Number(cell[4]),
            UnitID: unitID || "", // Handle null or undefined values
            UnitPrice: Number(cell[6]),
          });
        } catch (error) {
          // Handle any errors that occur during API calls
          console.error("Error fetching data:", error);
        }
      }

      // Update the state after all asynchronous operations have completed
      setBookings(newArr);
      excelPaste.current.value = null;
    });
  };

  const getBookingDetails = (item) => {
    fetch(process.env.REACT_APP_API_URL + "Bookings/" + item.PIID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.length > 0) {
          setBookings(result);
          setShowCanvas(true);
        }
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const handleChange = (e, index) => {
    let { name, value } = e.target;
    if (name === "TotalQuantity" || name === "UnitPrice") {
      value = parseFloat(value);
    }
    let list = [...bookings];
    list[index][name] = value;

    if (list[index]["TotalQuantity"] && list[index]["UnitPrice"]) {
      list[index]["TotalPrice"] =
        list[index]["TotalQuantity"] * list[index]["UnitPrice"];
    }

    setBookings(list);
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
  };

  const removeRowClick = (index) => {
    const list = [...bookings];
    list.splice(index, 1);
    setBookings(list);
  };

  const addRowClick = () => {
    setBookings([...bookings, {}]);
  };

  const saveBooking = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false || !master.SupplierID || !master.JobID) {
      e.stopPropagation();
      setShowIsRequiredMsg(true);
      setValidated(true);
      return;
    } else {
      setShowIsRequiredMsg(false);
    }

    for (let i = 0; i < bookings.length; i++) {
      if (
        !bookings[i].UnitID ||
        !bookings[i].ItemID ||
        !bookings[i].PurchaseOrderID
      ) {
        setShowIsRequiredMsg(true);
        return;
      }
    }

    saveData(
      "Bookings",
      "POST",
      { PI: master, Bookings: bookings },
      getAllBooking
    );
  };

  const deleteBooking = () => {
    deleteData("Bookings/" + master.PIID, "DELETE", null, getAllBooking);
  };

  const headers = [
    { label: "Order No", key: "purchaseOrderNo" },
    { label: "Date", key: "purchaseOrderDate" },
    { label: "Supplier", key: "supplierName" },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Booking">
        <Nav.Link
          onClick={() => {
            setMaster({});
            setBookings([]);
            setShowCanvas(true);
            setShowIsRequiredMsg(false);
            setValidated(false);
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
          filename="Booking.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col>
          <Row>
            <Col>
              <Row>
                <Form.Group as={Col}>
                  <PI
                    onChange={(value, action) => {
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]: value ? value.value : null,
                      });
                    }}
                    name="piId"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Supplier
                    onChange={(value, action) => {
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]: value ? value.value : null,
                      });
                    }}
                    name="supplierId"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <SalesOrder
                    onChange={(value, action) => {
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]: value ? value.value : null,
                      });
                    }}
                    name="purchaseOrderId"
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row className="mt-2 mb-2">
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive hover size="sm" striped>
                    <thead>
                      <tr>
                        <th>Ref No</th>
                        <th>PI No</th>
                        <th>PI Date</th>
                        <th>Supplier</th>
                        <th>Req. No</th>
                        <th>B2B No</th>
                        <th>Inhouse Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.dataLoading && (
                        <tr>
                          <td colSpan="8" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!res.dataLoading && res.data?.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data.map((item, index) => (
                        <tr
                          key={item.PIID}
                          onClick={() => {
                            setMaster(item);
                          }}
                          className={
                            item.PIID === master.PIID ? "table-active" : ""
                          }
                        >
                          <td>{item.ReferenceNo}</td>
                          <td>{item.PINo}</td>
                          <td>{item.PIDate}</td>
                          <td>{item.SupplierName}</td>
                          <td>{item.RequisitionNo}</td>
                          <td>{item.BackToBackLCNo}</td>
                          <td>{item.ApproximateInhouseDate}</td>
                          <td>
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => getBookingDetails(item)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>{" "}
                            <Button
                              variant="btn btn-sm btn-outline-danger"
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

      <Offcanvas
        show={showCanvas}
        onHide={() => {
          setShowCanvas(false);
          setValidated(false);
        }}
        placement="end"
        className="w-75"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Booking</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveBooking}
            method="POST"
          >
            <Card>
              <Card.Body>
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Supplier</Form.Label>
                    <Supplier
                      onChange={(value, action) =>
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="SupplierID"
                      selected={master.SupplierID}
                      isRequired={showIsRequiredMsg}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>PI No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      name="PINo"
                      value={master.PINo}
                      placeholder="PI No"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>PI Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="date"
                      name="PIDate"
                      value={master.PIDate}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Order Ref No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      name="OrderRefNo"
                      value={master.OrderRefNo}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Order Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      name="OrderDate"
                      type="date"
                      value={master.OrderDate}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Job No</Form.Label>
                    <LC
                      onChange={(value, action) =>
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="JobID"
                      selected={master.JobID}
                      isRequired={showIsRequiredMsg}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} sm="4">
                    <Form.Label>Loan From Job</Form.Label>
                    <LC
                      onChange={(value, action) =>
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="LoanFromJobID"
                      selected={master.LoanFromJobID}
                    />
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
            <Card className="mt-2">
              <Card.Body>
                <Row>
                  <Form.Group as={Col} sm="3">
                    <Form.Control
                      onPaste={onPaste}
                      ref={excelPaste}
                      placeholder="Excel Paste"
                    />
                  </Form.Group>
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th className="col-3">Purchase Order</th>
                        <th className="col-3">Item</th>
                        <th>Item Size</th>
                        <th>Item Color</th>
                        <th>Quantity</th>
                        <th className="col-2">Unit</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                        <th>
                          <Button
                            variant="outline-primary"
                            onClick={addRowClick}
                          >
                            <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                          </Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <SalesOrder
                                onChange={(value) => {
                                  x.PurchaseOrderID = value
                                    ? value.value
                                    : null;
                                  setBookings([...bookings]);
                                }}
                                name="PurchaseOrderID"
                                selected={x.PurchaseOrderID}
                                selectedPO={x.PONo}
                                isRequired={showIsRequiredMsg}
                              />
                            </td>
                            <td>
                              <Item
                                onChange={(value) => {
                                  x.ItemID = value ? value.value : null;
                                  setBookings([...bookings]);
                                }}
                                name="ItemID"
                                selected={x.ItemID}
                                isRequired={showIsRequiredMsg}
                              />
                            </td>
                            <td>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                name="ItemSize"
                                value={x.ItemSize}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                name="ItemColor"
                                value={x.ItemColor}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="TotalQuantity"
                                value={x.TotalQuantity}
                                onPaste={onPaste}
                                required
                              />
                            </td>
                            <td>
                              <Unit
                                onChange={(value) => {
                                  x.UnitID = value ? value.value : null;
                                  setBookings([...bookings]);
                                }}
                                name="UnitID"
                                selected={x.UnitID}
                                isRequired={showIsRequiredMsg}
                              />
                            </td>
                            <td>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="UnitPrice"
                                value={x.UnitPrice}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                name="TotalPrice"
                                value={(
                                  x.UnitPrice * x.TotalQuantity
                                ).toLocaleString("eng", {
                                  minimumFractionDigits: 2,
                                })}
                                readOnly
                              />
                            </td>

                            <td>
                              <Button
                                variant="outline-danger"
                                onClick={(e) => removeRowClick(i)}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={8}></td>
                        <td>
                          {bookings
                            .reduce(
                              (total, item) =>
                                (total += item.UnitPrice * item.TotalQuantity),

                              0
                            )
                            .toLocaleString("eng", {
                              minimumFractionDigits: 2,
                            })}
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
                    {master.PIID ? "Update" : "Save"}
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteBooking}
      />
    </Fragment>
  );
};

export default Booking;
