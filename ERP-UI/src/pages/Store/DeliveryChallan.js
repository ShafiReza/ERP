import { useState, createRef, Fragment } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  FormControl,
  Spinner,
  Nav,
  Pagination,
  Badge,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import useHttp from "../../components/hooks/useHttp";
import {
  Item,
  Unit,
  SalesOrder,
  Buyer,
  Store,
} from "../../components/DropDown";

import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
const csvLink = createRef();
const DeliveryChallan = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [master, setMaster] = useState({
    customerDetails: {},
    deliveryChallanDate: new Date().toISOString(),
  });
  const [validated, setValidated] = useState(false);
  const [deliveryChallanDetails, setInputList] = useState([
    { salesOrderId: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [res] = useGetAll("DeliveryChallan?", searchCriteria, toggle);
  const [, sendRequest] = useHttp();

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleRowClick = (item) => {
    fetch(process.env.REACT_APP_API_URL + "Customer/" + item.customerId, {
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
        item.customerDetails = result;
        setMaster(item);
        setInputList(item.deliveryChallanDetails);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const handleDeliveryChallanDetails = (value) => {
    fetch(process.env.REACT_APP_API_URL + "SalesOrder/" + value, {
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
        result.salesOrderDetails.forEach((item) => {
          arr.push({
            salesOrderId: item.salesOrderId,
            itemId: item.itemId,
            quantity: item.quantity,
            unitId: item.unitId,
            unitPrice: item.unitPrice,
          });
        });
        setInputList(arr);
        setMaster({ ...master, customerId: result.customerId });
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
    console.log(master);
  };

  const handleProductChange = (index, value) => {
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
        let list = [...deliveryChallanDetails];
        list[index]["unitId"] = result.unitId;
        list[index]["unitPrice"] = result.unitPrice;
        setInputList(list);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...deliveryChallanDetails];
    list[index][name] = value;

    setInputList(list);
  };

  const removeRowClick = (index) => {
    const list = [...deliveryChallanDetails];
    list.splice(index, 1);
    setInputList(list);
  };

  const removeMasterRowClick = (e, index, item) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(item);
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "DeliveryChallan", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        console.log(response.status);
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

  const addRowClick = () => {
    setInputList([
      ...deliveryChallanDetails,
      {
        salesOrderId: 0,
        itemId: "",
        quantity: 0,
        unitId: "",
        unitPrice: 0,
      },
    ]);
  };

  const onSuccess = (res) => {
    if (res.status === 200) {
      toast.success("Data Added Successfuly", {
        position: "bottom-right",
      });
    } else {
      toast.error(res.statusText + " - " + res.status, {
        position: "bottom-right",
      });
    }
    setToggle(!toggle);
    setValidated(false);
    setLoading(false);
  };

  const saveDeliveryChallan = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    master.deliveryChallanDetails = deliveryChallanDetails;
    const methodType = master.id ? "PUT" : "POST";
    setLoading(true);
    sendRequest("DeliveryChallan", methodType, master, onSuccess);
  };

  const headers = [
    { label: "Delivery No", key: "deliveryChalanNo" },
    { label: "Delivery Date", key: "deliveryChallanDate" },
    { label: "Buyer", key: "customerName" },
    { label: "Status", key: "isActive" },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Delivery Challan">
        <Form className="d-flex me-3">
          <FormControl
            type="search"
            placeholder="Search"
            className="mr-2"
            aria-label="Search"
          />
        </Form>

        <Nav.Link
          onClick={() => {
            setMaster({
              customerDetails: {},
              deliveryChallanDate: new Date().toISOString(),
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
          <Row>
            <Col>
              <Row>
                <Form.Group as={Col}>
                  <Store
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="storeId"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Buyer
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="customerId"
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
                        <th>Delivery Challan No</th>
                        <th>Date</th>

                        <th>Buyer</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.dataLoading && (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!res.dataLoading && res.data.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data.map((item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            handleRowClick(item);
                          }}
                          className={
                            item.id === master.id ? "table-active" : ""
                          }
                        >
                          <td>{item.deliveryChalanNo}</td>
                          <td>{item?.deliveryChallanDate?.split("T")[0]}</td>
                          <td>{item.customerName}</td>
                          <td>
                            <Badge bg={item.isActive ? "success" : "danger"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td></td>
                          <td>{item?.lastModifiedDate?.split("T")[0]}</td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => setShowCanvas(true)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>
                          </td>
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
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-75"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveDeliveryChallan}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm={3}>
                    <Form.Label>Delivery Chalan No</Form.Label>
                    <Form.Control
                      type="text"
                      name="deliveryChalanNo"
                      value={master.deliveryChalanNo}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={3}>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="deliveryChallanDate"
                      value={master?.deliveryChallanDate?.split("T")[0]}
                      onChange={(e) => handleMaster(e)}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={3}>
                    <Form.Label>Buyer</Form.Label>
                    <Buyer
                      onChange={(value, action) =>
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="customerId"
                      selected={master.customerId}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={3}>
                    <Form.Label>Sales Order</Form.Label>
                    <SalesOrder
                      onChange={(value, action) => {
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        });
                        handleDeliveryChallanDetails(
                          value ? value.value : null
                        );
                      }}
                      name="salesOrderId"
                      selected={master.salesOrderId}
                    />
                  </Form.Group>
                </Row>
                <Table striped size="sm" responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Unit Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryChallanDetails.map((x, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <Item
                              onChange={(value) => {
                                x.itemId = value ? value.value : null;
                                setInputList([...deliveryChallanDetails]);
                                // handleSalesOrder(i);
                                handleProductChange(
                                  i,
                                  value ? value.value : null
                                );
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
                                  setInputList([...deliveryChallanDetails]);
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
                            <Button
                              variant="primary"
                              type=""
                              onClick={addRowClick}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                            </Button>

                            <Button
                              variant="danger"
                              type=""
                              className="ms-2"
                              onClick={(e) => removeRowClick(i)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Button variant="light" type="submit" as={Col} sm={1}>
                  Cancel
                </Button>
                {loading ? (
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

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default DeliveryChallan;
