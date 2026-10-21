import { useState, createRef, Fragment } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  Pagination,
  Badge,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { Item, Unit, Supplier } from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
const csvLink = createRef();
const Billing = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [master, setMaster] = useState({
    supplierId: 0,
    supplierDetails: {},
    billingDetails: [{}],
    billingDate: new Date().toISOString(),
  });
  const [validated, setValidated] = useState(false);
  const [purchaseOrderList, setPurchaseOrderList] = useState([]);
  const [billingDetails, setInputList] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [res] = useGetAll("Billing?", searchCriteria, toggle);

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

  const handleSupplierChange = (value) => {
    fetch(
      process.env.REACT_APP_API_URL +
        "PurchaseOrder?" +
        new URLSearchParams({
          pageIndex: 1,
          pageSize: 10,
          supplierId: value,
        }),
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
        let arr = [];
        result.forEach((item) => {
          arr.push({
            id: item.id,
            purchaseOrderNo: item.purchaseOrderNo,
          });
        });
        setPurchaseOrderList(arr);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const handleBillingDetails = (value) => {
    fetch(process.env.REACT_APP_API_URL + "PurchaseOrder/" + value, {
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
        let arr = [];
        result.purchaseOrderDetails.forEach((item) => {
          arr.push({
            purchaseOrderId: item.purchaseOrderId,
            itemId: item.itemId,
            quantity: item.quantity,
            unitId: item.unitId,
            unitPrice: item.unitPrice,
            TotalPrice: item.quantity * item.unitPrice,
          });
        });
        setInputList(arr);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const handleRowClick = (item) => {
    fetch(process.env.REACT_APP_API_URL + "Supplier/" + item.supplierId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        return res.status === 200 ? res.json() : 0;
      })
      .then((result) => {
        item.supplierDetails = result;
        setMaster(item);
        setInputList(item.billingDetails);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };
  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
    if (name === "shippingCharge") {
      getInvoiceTotal();
    }
  };

  const handleItemChange = (index, value) => {
    fetch(process.env.REACT_APP_API_URL + "Item/" + value, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        let list = [...billingDetails];
        list[index]["unitId"] = result.unitId;
        list[index]["unitPrice"] = result.unitPrice;
        setInputList(list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e, index) => {
    console.log(master);
    const { name, value } = e.target;
    let list = [...billingDetails];
    list[index][name] = value;
    list[index].TotalPrice = list[index].unitPrice
      ? list[index].quantity * list[index].unitPrice
      : 0;

    setInputList(list);
  };

  const removeRowClick = (index) => {
    const list = [...billingDetails];
    list.splice(index, 1);
    setInputList(list);
  };
  const removeMasterRowClick = (e, index, item) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(item);
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Billing", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Delete Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setLoading(false);
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addRowClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputList([
      ...billingDetails,
      {
        purchaseOrderId: 0,
        itemId: "",
        quantity: 0,
        unitId: "",
        unitPrice: 0,
      },
    ]);
  };

  const getInvoiceTotal = () => {
    let sum = 0;
    let shippingCharge = master.shippingCharge ? master.shippingCharge : 0;
    billingDetails.forEach((el) => (sum += Number(el.quantity * el.unitPrice)));
    return Number(sum) + Number(shippingCharge);
  };

  const saveBilling = async (e) => {
    master.billingDetails = billingDetails;
    const methodType = master.id ? "PUT" : "POST";
    const form = e.currentTarget;
    if (form.checkValidity() === false || master.supplierId === 0) {
      if (master.supplierId === 0) {
        toast.error("Supplier Cannot be missing", {
          position: "top-center",
        });
      }
      e.preventDefault();
      e.stopPropagation();
    } else {
      setLoading(true);
      e.preventDefault();

      fetch(process.env.REACT_APP_API_URL + "Billing", {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(master),
      })
        .then((res) => res.json())
        .then((result) => {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
          setMaster({ ...master, billingNo: result });
          setValidated(false);
          setLoading(false);
          setToggle(!toggle);
        });
    }
    setValidated(true);
  };
  const headers = [
    { label: "Billing No", key: "billingNo" },
    { label: "Billing Date", key: "billingDate" },
    { label: "Supplier", key: "supplierName" },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Billing">
        <Nav.Link
          onClick={() => {
            setMaster({
              supplierId: 0,
              supplierDetails: {},
              billingDetails: [{}],
              billingDate: new Date().toISOString(),
            });
            setInputList([{}]);
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
      <Row className="mt-2">
        <Col>
          <Row className="mb-2">
            <Col>
              <Row>
                <Form.Group as={Col}>
                  <Form.Control
                    onBlur={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        billingNo: e.target.value,
                      })
                    }
                    type="text"
                    name="billingNo"
                    placeholder="Billing No"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>From</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setSearchCriteria({
                          ...searchCriteria,
                          fromDate: e.target.value,
                        })
                      }
                      type="date"
                      name="fromDate"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>To</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setSearchCriteria({
                          ...searchCriteria,
                          toDate: e.target.value,
                        })
                      }
                      type="date"
                      name="toDate"
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive hover size="sm" striped>
                    <thead>
                      <tr>
                        <th>Billing No</th>
                        <th>Billing Date</th>
                        <th>Supplier</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Quantity</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.dataLoading && (
                        <tr>
                          <td colSpan="7" className="text-center">
                            <Spinner
                              animation="border"
                              variant="outline-primary"
                            />
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
                          key={item.id}
                          onClick={() => {
                            handleRowClick(item);
                          }}
                          className={
                            item.id === master.id ? "table-active" : ""
                          }
                        >
                          <td>{item.billingNo}</td>
                          <td>{item.billingDate.split("T")[0]}</td>
                          <td>{item.supplierName}</td>
                          <td>
                            <Badge bg={item.isActive ? "success" : "danger"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td>
                            {item.billingDetails
                              .reduce((total, ele) => {
                                return (total += ele.quantity * ele.unitPrice);
                              }, 0)
                              .toLocaleString()}
                          </td>
                          <td>
                            {item.billingDetails
                              .reduce((total, ele) => {
                                return (total += ele.quantity);
                              }, 0)
                              .toLocaleString()}
                          </td>
                          <td>{item.lastModifiedDate.split("T")[0]}</td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-danger"
                              type=""
                              onClick={(e) =>
                                removeMasterRowClick(e, index, item)
                              }
                            >
                              <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                            </Button>
                          </td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              type=""
                              onClick={() => setShowCanvas(true)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
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
        onHide={handleClose}
        placement="end"
        className="w-75"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveBilling}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Control
                      placeholder="Billing No"
                      type="text"
                      name="billingNo"
                      value={master.billingNo}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="date"
                      name="billingDate"
                      value={master.billingDate.split("T")[0]}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Supplier
                      onChange={(value, action) => {
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        });
                        handleSupplierChange(value ? value.value : null,);
                      }}
                      name="supplierId"
                      selected={master.supplierId}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Select
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setMaster({
                          ...master,
                          [name]: value,
                        });
                        handleBillingDetails(value);
                      }}
                      aria-label="Default select example"
                      value={master.purchaseOrderId}
                      name="purchaseOrderId"
                    >
                      <option>Select PurchaseOrder</option>
                      {purchaseOrderList.map((val, i) => (
                        <option value={val.id} key={i}>
                          {val.purchaseOrderNo}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Table responsive striped hover size="sm" className="mb-2">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingDetails.map((x, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <Item
                              onChange={(value) => {
                                x.itemId = value ? value.value : null;
                                setInputList([...billingDetails]);
                                handleItemChange(i, value ? value.value : null);
                              }}
                              name="itemId"
                              selected={x.itemId}
                            />
                          </td>
                          <td>
                            <Form.Group>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="quantity"
                                value={x.quantity}
                                required
                              />
                            </Form.Group>
                          </td>

                          <td>
                            <Form.Group>
                              <Unit
                                onChange={(value) => {
                                  x.unitId = value ? value.value : null;
                                  setInputList([...billingDetails]);
                                }}
                                name="unitId"
                                selected={x.unitId}
                              />
                            </Form.Group>
                          </td>
                          <td>
                            <Form.Group>
                              <Form.Control
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="unitPrice"
                                value={x.unitPrice}
                                required
                              />
                            </Form.Group>
                          </td>

                          <td>
                            <Form.Group>
                              <Form.Control
                                //onChange={(e) => handleChange(e, i)}
                                type="number"
                                name="TotalPrice"
                                value={x.quantity * x.unitPrice}
                                readOnly
                              />
                            </Form.Group>
                          </td>

                          <td>
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              type=""
                              onClick={addRowClick}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                            </Button>

                            <Button
                              variant="btn btn-sm btn-outline-danger"
                              type=""
                              onClick={(e) => removeRowClick(i)}
                              className="ms-2"
                            >
                              <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="fw-bold">
                      <td align="right" colSpan={5}>
                        Shipping Charge:
                      </td>
                      <td>
                        <Form.Group>
                          <Form.Control
                            onChange={(e) => handleMaster(e)}
                            type="number"
                            name="shippingCharge"
                            value={master.shippingCharge}
                          />
                        </Form.Group>
                      </td>
                      <td></td>
                    </tr>
                    <tr className="fw-bold">
                      <td align="right" colSpan={5}>
                        Total :
                      </td>
                      <td>{getInvoiceTotal()}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
                <Button variant="light" type="submit" as={Col} sm={1}>
                  Cancel
                </Button>
                {loading ? (
                  <Button
                    variant="outline-primary"
                    disabled
                    className="float-end"
                  >
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
                    variant="outline-primary"
                    type="submit"
                    className="float-end"
                  >
                    Save
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default Billing;
